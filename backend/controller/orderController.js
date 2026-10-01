import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../model/orderModel.js';
import Product from '../model/productsModel.js';
import Coupon from '../model/couponModel.js';
import Address from '../model/addressModel.js';
import Notification from '../model/notificationModel.js';
import { sendToUser } from '../socket/index.js';


export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// @desc Create new order
// POST /api/orders
// @access private
export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, addressId, paymentMethod, couponCode } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order item');
  }

  const productIds = orderItems.map((x) => x._id);
  const products = await Product.find({
    _id: { $in: productIds },
    status: 'Active',
  });
  const selectedAddress = await Address.findOne({
    _id: addressId,
    user: req.user._id,
  });
  const couponOrder = couponCode
    ? await Coupon.findOne({
        code: couponCode,
        isHidden: false,
        expiry: { $gte: new Date() },
      })
    : null;

  if (couponCode && !couponOrder) {
    res.status(400);
    throw new Error('The discount code is invalid or has expired.');
  }

  if (couponOrder && couponOrder.useCount >= couponOrder.usageLimit) {
    res.status(400);
    throw new Error('Coupon has reached its usage limit');
  }

  if (couponOrder) {
    const alreadyUsed = await Order.findOne({
      user: req.user._id,
      couponId: couponOrder._id,
      isCancelled: { $ne: true },
    });
    if (alreadyUsed) {
      res.status(400);
      throw new Error('You have already used this coupon code.');
    }
  }

  let discount = 0;

  if (!selectedAddress) {
    res.status(404);
    throw new Error('Shipping address not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const orderItemsData = [];

    for (const x of orderItems) {
      const qty = Number(x.qty);
      if (!Number.isInteger(qty) || qty <= 0) {
        throw new Error(`Invalid quantity for the product: ${x._id}`);
      }

      const matchedProduct = products.find(
        (p) => p._id.toString() === x._id.toString(),
      );
      if (!matchedProduct) {
        throw new Error(`Product not found with id: ${x._id}`);
      }

      let selectedVariant;
      if (x.variantId || x.sku) {
        selectedVariant = matchedProduct.variants.find(
          (v) =>
            (v._id &&
              x.variantId &&
              v._id.toString() === x.variantId.toString()) ||
            (v.sku && x.sku && v.sku === x.sku),
        );
      } else {
        selectedVariant = matchedProduct.variants[0];
      }

      if (!selectedVariant) {
        throw new Error(
          `Variant not found for product: ${matchedProduct.name}`,
        );
      }

      const availableStock =
        selectedVariant.countInStock - selectedVariant.reserved;
      if (availableStock < qty) {
        throw new Error(
          `Product ${matchedProduct.name} (Variant: ${selectedVariant.color || 'Default'}) out of stock`,
        );
      }

      let stockResult;
      if (paymentMethod === 'COD') {
        stockResult = await Product.findOneAndUpdate(
          {
            _id: matchedProduct._id,
            'variants._id': selectedVariant._id,
          },
          { $inc: { 'variants.$.countInStock': -qty } },
          { session, new: true },
        );
      } else {
        stockResult = await Product.findOneAndUpdate(
          {
            _id: matchedProduct._id,
            'variants._id': selectedVariant._id,
          },
          { $inc: { 'variants.$.reserved': qty } },
          { session, new: true },
        );
      }

      if (!stockResult) {
        throw new Error(
          `product ${matchedProduct.name}(${selectedVariant.color}) out of stock`,
        );
      }

      orderItemsData.push({
        ...x,
        product: matchedProduct._id,
        price: selectedVariant.price,
        variantId: selectedVariant._id,
        sku: selectedVariant.sku,
        size: selectedVariant.size,
        color: selectedVariant.color,
        qty,
        _id: undefined,
      });
    }

    const itemsPrice = addDecimals(
      orderItemsData.reduce((acc, item) => acc + item.price * item.qty, 0),
    );

    const shippingPrice = addDecimals(itemsPrice > 500000 ? 0 : 30000);

    const taxPrice = addDecimals(Number(0.15 * itemsPrice).toFixed(2));

    if (
      couponOrder &&
      couponOrder.minSpend &&
      itemsPrice < couponOrder.minSpend
    ) {
      res.status(400);
      throw new Error(
        `The order must be at least ${couponOrder.minSpend.toLocaleString()} VND to apply this code.`,
      );
    }

    if (couponOrder) {
      await Coupon.updateOne(
        { _id: couponOrder._id },
        { $inc: { useCount: 1 } },
        { session },
      );
      if (couponOrder.discountType === 'percentage') {
        const rate = Math.min(Math.max(couponOrder.discountValue, 0), 100);
        discount = (itemsPrice * rate) / 100;
      } else if (couponOrder.discountType === 'fixed') {
        discount = Math.min(couponOrder.discountValue, Number(itemsPrice));
      }
    }

    const roundedDiscount = Number(addDecimals(discount));

    const totalPrice = Math.max(
      0,
      Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice) -
        roundedDiscount,
    ).toFixed(2);

    const isCOD = paymentMethod === 'COD';

    const order = new Order({
      orderItems: orderItemsData,
      user: req.user._id,
      shippingAddress: {
        addressRef: selectedAddress._id,
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        city: selectedAddress.city,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
      },
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discount: roundedDiscount,
      totalPrice,
      couponId: couponOrder ? couponOrder._id : null,
      orderStatus: isCOD ? 'CONFIRMED' : 'PENDING_PAYMENT',
      confirmedAt: isCOD ? new Date() : undefined,
      reservationExpiresAt: isCOD ? null : new Date(Date.now() + 30 * 60 * 1000),
      statusHistory: [
        {
          status: isCOD ? 'CONFIRMED' : 'PENDING_PAYMENT',
          note: isCOD
            ? 'Order placed with Cash on Delivery (COD)'
            : 'Order created, awaiting payment',
          updatedAt: new Date(),
          updatedBy: req.user._id,
        },
      ],
    });

    const createOrder = await order.save({ session });

    await session.commitTransaction();
    res.status(201).json(createOrder);
  } catch (err) {
    await session.abortTransaction();
    res.status(400);
    throw err;
  } finally {
    session.endSession();
  }
});

// @desc Get logged in user order
// GET /api/orders/mine
// @access private
export const getMyOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json(orders);
});

// @desc Get order by id
// POST /api/orders/:id
// @access private
export const getOrderByID = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('shippingAddress.addressRef');

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('404 Not Found');
  }
});

const VALID_TRANSITIONS = {
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPING', 'CANCELLED'],
  SHIPPING: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

// @desc Update order status
// PUT /api/orders/:id/status
// @access private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const currentStatus =
    order.orderStatus ||
    (order.isDelivered
      ? 'DELIVERED'
      : order.isCancelled
        ? 'CANCELLED'
        : order.isPaid
          ? 'CONFIRMED'
          : 'PENDING_PAYMENT');

  if (currentStatus === status) {
    return res.status(200).json(order);
  }

  const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowedTransitions.includes(status)) {
    res.status(400);
    throw new Error(`Cannot change status from ${currentStatus} to ${status}`);
  }

  if (status === 'CANCELLED') {
    const cancelledOrder = await cancelOrderPayment(
      order._id,
      note || 'Cancelled by Admin',
      req.user?._id,
    );
    return res.status(200).json(cancelledOrder);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (status === 'CONFIRMED') {
      order.confirmedAt = Date.now();
    } else if (status === 'SHIPPING') {
      order.shippedAt = Date.now();
    } else if (status === 'DELIVERED') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      // If Cash on Delivery and not paid yet, mark paid upon successful delivery
      if (order.paymentMethod === 'COD' && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: `COD-${Date.now()}`,
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
        };
      }

      // Update qtySold
      for (const item of order.orderItems) {
        const stockResult = await Product.updateOne(
          { _id: item.product, 'variants._id': item.variantId },
          {
            $inc: {
              qtySold: item.qty,
            },
          },
          { session },
        );

        if (stockResult.matchedCount === 0) {
          throw new Error(
            `No product found to update sales quantity: ${item.name}`,
          );
        }
      }
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      note: note || `Order status updated to ${status}`,
      updatedAt: new Date(),
      updatedBy: req.user?._id,
    });

    const updatedOrder = await order.save({ session });
    await session.commitTransaction();

    // Send notification to user
    try {
      const statusNotificationMap = {
        CONFIRMED: {
          type: 'ORDER_CONFIRMED',
          title: 'Order Confirmed',
          message: 'Your order has been confirmed and is being prepared.',
        },
        SHIPPING: {
          type: 'ORDER_SHIPPING',
          title: 'Order Shipped',
          message: 'Your order is currently on its way to you!',
        },
        DELIVERED: {
          type: 'DELIVERED',
          title: 'Order Delivered',
          message: 'Your order has been successfully delivered!',
        },
      };

      const notif = statusNotificationMap[status];
      if (notif) {
        const newNotification = new Notification({
          recipient: order.user,
          sender: req.user?._id || null,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          relatedId: order._id,
          relatedModel: 'Order',
        });

        await newNotification.save();
        sendToUser(order.user.toString(), 'newNotification', newNotification);
      }
    } catch (err) {
      console.error('Failed to send status notification:', err);
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

// @desc Update order to delivered (Legacy backwards-compatible endpoint)
// PUT /api/orders/:id/deliver
// @access private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  req.body = { status: 'DELIVERED', note: 'Marked as delivered' };
  return updateOrderStatus(req, res);
});

// @desc get all orders
// GET /api/orders
// @access private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');

  res.status(200).json(orders);
});

// Hàm dùng chung trừ countInStock
export const processOrderPayment = async (orderId, paymentResultData) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  if (order.isPaid) {
    return order;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const item of order.orderItems) {
      const stockResult = await Product.updateOne(
        { _id: item.product, 'variants._id': item.variantId },
        {
          $inc: {
            'variants.$.countInStock': -item.qty,
            'variants.$.reserved': -item.qty,
          },
        },
        { session },
      );

      if (stockResult.matchedCount === 0) {
        throw new Error(
          `No product/variant found to deduct from inventory: ${item.name}`,
        );
      }
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResultData;
    order.orderStatus = 'CONFIRMED';
    order.confirmedAt = Date.now();
    order.statusHistory.push({
      status: 'CONFIRMED',
      note: 'Payment completed successfully',
      updatedAt: new Date(),
    });

    const updatedOrder = await order.save({ session });
    await session.commitTransaction();
    return updatedOrder;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

// Hàm giải phóng số lượng giữ chỗ (reserved), hoàn lại useCount của coupon và đánh dấu hủy đơn
export const cancelOrderPayment = async (
  orderId,
  note = 'Order cancelled',
  cancelledBy = null,
) => {
  const order = await Order.findById(orderId);

  if (!order || order.isCancelled) {
    return order;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product).session(session);
      const targetVariantId = item.variantId || product?.variants[0]?._id;

      if (targetVariantId) {
        // If order was already paid or was COD, countInStock was deducted -> restore countInStock
        if (order.isPaid || order.paymentMethod === 'COD') {
          await Product.updateOne(
            { _id: item.product, 'variants._id': targetVariantId },
            { $inc: { 'variants.$.countInStock': item.qty } },
            { session },
          );
        } else {
          // Online payment pending: only reserved was incremented -> release reserved
          await Product.updateOne(
            { _id: item.product, 'variants._id': targetVariantId },
            { $inc: { 'variants.$.reserved': -item.qty } },
            { session },
          );
        }
      }
    }

    if (order.couponId) {
      await Coupon.updateOne(
        { _id: order.couponId, useCount: { $gt: 0 } },
        { $inc: { useCount: -1 } },
        { session },
      );
    }

    order.orderStatus = 'CANCELLED';
    order.isCancelled = true;
    order.cancelledAt = new Date();
    order.statusHistory.push({
      status: 'CANCELLED',
      note,
      updatedAt: new Date(),
      updatedBy: cancelledBy,
    });
    const updatedOrder = await order.save({ session });

    await session.commitTransaction();
    return updatedOrder;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

// @desc Update order to paid
// PUT /api/orders/:id/pay
// @access private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const updatedOrder = await processOrderPayment(req.params.id, {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address,
  });
  res.status(200).json(updatedOrder);
});

// @desc Customer cancels their own order
// PUT /api/orders/:id/cancel
// @access private (Customer owner)
export const cancelMyOrder = asyncHandler(async (req, res) => {
  const { reason, note } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check ownership
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }

  if (order.isCancelled || order.orderStatus === 'CANCELLED') {
    res.status(400);
    throw new Error('This order has already been cancelled');
  }

  // Only allow cancellation when order is in PENDING_PAYMENT or CONFIRMED
  const cancellableStatuses = ['PENDING_PAYMENT', 'CONFIRMED'];
  if (!cancellableStatuses.includes(order.orderStatus)) {
    res.status(400);
    throw new Error(
      `Cannot cancel order with status ${order.orderStatus}. Orders can only be cancelled before shipping.`,
    );
  }

  const cancelNote = reason
    ? `Customer cancelled: ${reason}${note ? ` (${note})` : ''}`
    : note || 'Customer cancelled';

  const updatedOrder = await cancelOrderPayment(
    order._id,
    cancelNote,
    req.user._id,
  );

  // Send notification to customer
  try {
    const newNotification = new Notification({
      recipient: order.user,
      sender: req.user._id,
      type: 'ORDER_CANCELLED',
      title: 'Order Cancelled',
      message: `Your order #${order._id.toString().slice(-6)} has been cancelled successfully.`,
      relatedId: order._id,
      relatedModel: 'Order',
    });
    await newNotification.save();
    sendToUser(order.user.toString(), 'newNotification', newNotification);
  } catch (err) {
    console.error('Failed to send cancel notification:', err);
  }

  res.status(200).json(updatedOrder);
});

