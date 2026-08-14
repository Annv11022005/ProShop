import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../model/orderModel.js';
import { processOrderPayment, cancelOrderPayment } from './orderController.js';
import { VNPay, ignoreLogger, VnpLocale, ProductCode, dateFormat } from 'vnpay';

function generatePayID() {
  const now = new Date();
  const timestamp = now.getTime();
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

  return `PAY${timestamp}${seconds}${milliseconds}`;
}

export const createPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('order not found');
  }

  if (order.paymentMethod.toLowerCase() === 'vnpay') {
    const vnpay = new VNPay({
      tmnCode: process.env.tmnCode,
      secureSecret: process.env.VNPAYSECRET,
      vnpayHost: 'https://sandbox.vnpayment.vn',

      // Cấu hình tùy chọn
      testMode: true,
      hashAlgorithm: 'SHA512',
      enableLog: true,
      loggerFn: ignoreLogger,

      // Custom endpoints
      endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
      },
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: Number(order.totalPrice),
      vnp_IpAddr:
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip,
      vnp_TxnRef: `${order._id}_${generatePayID()}`,
      vnp_OrderInfo: `Thanh toan don hang ${order._id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });

    res.status(200).json({
      success: true,
      paymentUrl,
    });
  } else {
    res.status(400);
    throw new Error('Phương thức thanh toán không tồn tại');
  }
});

export const VNPayCallback = asyncHandler(async (req, res) => {
  const {
    vnp_ResponseCode,
    vnp_TxnRef,
    vnp_Amount,
    vnp_TransactionNo,
    vnp_PayDate,
  } = req.query;

  const vnpay = new VNPay({
    tmnCode: process.env.tmnCode,
    secureSecret: process.env.VNPAYSECRET,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: 'SHA512',
    enableLog: true,
    loggerFn: ignoreLogger,
  });

  const verify = vnpay.verifyReturnUrl(req.query);

  if (!verify.isVerified) {
    return res
      .status(200)
      .json({ RspCode: '97', Message: 'Invalid signature' });
  }

  if (!verify.isVerified || vnp_ResponseCode !== '00') {
    if (orderId) {
      await cancelOrderPayment(orderId);
    }
    return res
      .status(400)
      .json({ Message: 'Payment failed and returned to warehouse.' });
  }

  const orderId = vnp_TxnRef?.split('_')[0];
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
  }

  if (order.isPaid) {
    return res
      .status(200)
      .json({ RspCode: '02', Message: 'Order already confirmed' });
  }

  await processOrderPayment(orderId, {
    id: vnp_TransactionNo,
    status: vnp_ResponseCode,
    update_time: vnp_PayDate,
  });

  return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
});
