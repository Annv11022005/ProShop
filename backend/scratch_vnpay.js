import { VNPay, ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
  tmnCode: 'VESQ3VUN',
  secureSecret: 'QNPEOFUMQSKZMPWJURJSISHOUVWRTMMI',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  enableLog: false,
  loggerFn: ignoreLogger,
});

const sampleQuery = {
  vnp_Amount: '189635000',
  vnp_BankCode: 'NCB',
  vnp_BankTranNo: 'VNP15657026',
  vnp_CardType: 'ATM',
  vnp_OrderInfo: 'Thanh toan don hang 6a7f3ef629c0632913f6cd93',
  vnp_PayDate: '20260814231348',
  vnp_ResponseCode: '00',
  vnp_TmnCode: 'VESQ3VUN',
  vnp_TransactionNo: '15657026',
  vnp_TransactionStatus: '00',
  vnp_TxnRef: '6a7f3ef629c0632913f6cd93_PAY178672408924249242',
  vnp_SecureHash: 'a774a25c339a99579e7e45d0cd1a41212ce2adfd9b3d167dceb400a61fba1fdead5ebce10ff59aa69cfefdaf3ca04ade1a060994cc3fec3505c70abb35ef98b5'
};

async function test() {
  const verifyReturn = vnpay.verifyReturnUrl(sampleQuery);
  console.log('verifyReturnUrl result:', verifyReturn);

  const verifyIpn = await vnpay.verifyIpnCall(sampleQuery);
  console.log('verifyIpnCall result:', verifyIpn);
}

test();
