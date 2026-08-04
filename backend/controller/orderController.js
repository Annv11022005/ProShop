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
  const products = await Product.find({ _id: { $in: productIds } });
  const selectedAddress = await Address.findOne({
    _id: addressId,
    user: req.user._id,
  });
  const couponOrder = couponCode ? await Coupon.findOne({ code: couponCode }) : null;
  let discount = 0;

  if (!selectedAddress) {
    res.status(404);
    throw new Error('Shipping address not found');
  }

  const orderItemsData = orderItems.map((x) => {
    const matchedProduct = products.find(
      (p) => p._id.toString() === x._id.toString(),
    );

    if (!matchedProduct) {
      res.status(404);
      throw new Error(`Product not found with id: ${x._id}`);
    }

    return {
      ...x,
      product: matchedProduct._id,
      price: matchedProduct.price,
      qty: x.qty,
      _id: undefined,
    };
  });

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

  const createOrder = await order.save();

  res.status(201).json(createOrder);
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

// @desc Update order to paid
// PUT /api/orders/:id/pay
// @access private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
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
