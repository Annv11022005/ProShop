import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../model/orderModel.js';
import Product from '../model/productsModel.js';
import Coupon from '../model/couponModel.js';
import Address from '../model/addressModel.js';

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
        expiryDate: { $gte: new Date() },
      })
    : null;

  if (couponCode && !couponOrder) {
    res.status(400);
    throw new Error('The discount code is invalid or has expired.');
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

      const stockResult = await Product.findOneAndUpdate(
        {
          _id: matchedProduct._id,
          'variants._id': selectedVariant._id,
        },
        { $inc: { 'variants.$.reserved': qty } },
        { session, new: true },
      );

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
    if (couponOrder) {
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

// @desc Update order to delivered
// PUT /api/orders/:id/deliver
// @access private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
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

  // if (order.isPaid) {
  //   throw new Error('The order has already been paid for.');
  // }

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

// Hàm giải phóng số lượng giữ chỗ (reserved) khi thanh toán thất bại/hủy đơn
export const cancelOrderPayment = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order || order.isPaid) {
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      const targetVariantId = item.variantId || product?.variants[0]?._id;

      if (targetVariantId) {
        await Product.updateOne(
          { _id: item.product, 'variants._id': targetVariantId },
          { $inc: { 'variants.$.reserved': -item.qty } },
          { session },
        );
      }
    }

    await session.commitTransaction();
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
