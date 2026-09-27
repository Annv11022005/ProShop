import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import ReturnRequest from '../model/returnRequestModel.js';
import Order from '../model/orderModel.js';
import Product from '../model/productsModel.js';
import Notification from '../model/notificationModel.js';
import { sendToUser } from '../socket/index.js';

// Helper to push notification to user
const sendNotification = async ({
  recipientId,
  senderId = null,
  type,
  title,
  message,
  relatedId,
  relatedModel = 'ReturnRequest',
}) => {
  try {
    const notif = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      relatedId,
      relatedModel,
    });
    await notif.save();
    sendToUser(recipientId.toString(), 'newNotification', notif);
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

// @desc    Create new return/exchange request
// @route   POST /api/v1/returns
// @access  Private (Customer)
export const createReturnRequest = asyncHandler(async (req, res) => {
  const { orderId, type, reason, description, images, bankInfo } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only the customer who placed the order can submit a return request
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the customer who placed this order can submit a return request');
  }

  if (req.user.isAdmin) {
    res.status(403);
    throw new Error('Admins cannot submit return requests. This action is reserved for customers.');
  }

  // Must be DELIVERED
  const isDelivered =
    order.orderStatus === 'DELIVERED' || order.isDelivered;
  if (!isDelivered) {
    res.status(400);
    throw new Error('Only delivered orders can be requested for return or exchange');
  }

  // Check 14-day limit from delivery date
  const deliveredDate = order.deliveredAt || order.updatedAt;
  const diffTime = Math.abs(Date.now() - new Date(deliveredDate).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 14) {
    res.status(400);
    throw new Error(
      `Return request expired. Orders can only be returned within 14 days of delivery (Delivered ${diffDays} days ago).`,
    );
  }

  // Check if an active return request already exists
  const activeExisting = await ReturnRequest.findOne({
    order: orderId,
    status: { $in: ['PENDING_APPROVAL', 'APPROVED', 'RETURNING', 'RECEIVED'] },
  });
  if (activeExisting) {
    res.status(400);
    throw new Error('An active return or exchange request already exists for this order');
  }

  // Create Return Request document
  const returnDoc = new ReturnRequest({
    order: order._id,
    user: req.user._id,
    type,
    reason,
    description,
    images,
    refundAmount: order.totalPrice,
    bankInfo: type === 'RETURN_REFUND' ? bankInfo : undefined,
    status: 'PENDING_APPROVAL',
    timeline: [
      {
        status: 'PENDING_APPROVAL',
        note: `Return request created by customer (${type === 'RETURN_REFUND' ? 'Refund' : 'Exchange'})`,
        updatedBy: req.user._id,
        updatedAt: new Date(),
      },
    ],
  });

  const savedReturn = await returnDoc.save();

  // Update order with reference and returnStatus
  order.returnStatus = 'REQUESTED';
  order.returnRequest = savedReturn._id;
  order.statusHistory.push({
    status: 'RETURN_REQUESTED',
    note: `Customer requested ${type === 'RETURN_REFUND' ? 'Return & Refund' : 'Exchange'}`,
    updatedAt: new Date(),
    updatedBy: req.user._id,
  });
  await order.save();

  res.status(201).json(savedReturn);
});

// @desc    Get return request by Order ID
// @route   GET /api/v1/returns/order/:orderId
// @access  Private (Owner or Admin)
export const getReturnRequestByOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const returnDoc = await ReturnRequest.findOne({ order: orderId })
    .populate('order')
    .populate('user', 'name email')
    .populate('adminReview.reviewedBy', 'name');

  if (!returnDoc) {
    return res.status(200).json(null);
  }

  if (
    returnDoc.user._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to view this return request');
  }

  res.status(200).json(returnDoc);
});

// @desc    Get return request by ID
// @route   GET /api/v1/returns/:id
// @access  Private (Owner or Admin)
export const getReturnRequestById = asyncHandler(async (req, res) => {
  const returnDoc = await ReturnRequest.findById(req.params.id)
    .populate('order')
    .populate('user', 'name email')
    .populate('adminReview.reviewedBy', 'name');

  if (!returnDoc) {
    res.status(404);
    throw new Error('Return request not found');
  }

  if (
    returnDoc.user._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to view this return request');
  }

  res.status(200).json(returnDoc);
});

// @desc    Get current user's return requests
// @route   GET /api/v1/returns/mine
// @access  Private (Customer)
export const getMyReturnRequests = asyncHandler(async (req, res) => {
  const returns = await ReturnRequest.find({ user: req.user._id })
    .populate('order')
    .sort({ createdAt: -1 });

  res.status(200).json(returns);
});

// @desc    Get all return requests with filters and pagination
// @route   GET /api/v1/returns
// @access  Private (Admin)
export const getAllReturnRequests = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const status = req.query.status;

  const filter = {};
  if (status && status !== 'ALL') {
    filter.status = status;
  }

  const count = await ReturnRequest.countDocuments(filter);
  const returns = await ReturnRequest.find(filter)
    .populate('order', 'totalPrice paymentMethod isPaid createdAt')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Count pending approval for dashboard badge
  const pendingCount = await ReturnRequest.countDocuments({
    status: 'PENDING_APPROVAL',
  });

  res.status(200).json({
    returns,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
    pendingCount,
  });
});

// @desc    Review return request (Approve or Reject)
// @route   PUT /api/v1/returns/:id/review
// @access  Private (Admin)
export const reviewReturnRequest = asyncHandler(async (req, res) => {
  const { action, rejectReason, warehouseAddress, instructions } = req.body;

  const returnDoc = await ReturnRequest.findById(req.params.id).populate('order');
  if (!returnDoc) {
    res.status(404);
    throw new Error('Return request not found');
  }

  if (returnDoc.status !== 'PENDING_APPROVAL') {
    res.status(400);
    throw new Error(`Cannot review a request that is already ${returnDoc.status}`);
  }

  const order = returnDoc.order;

  if (action === 'APPROVE') {
    returnDoc.status = 'APPROVED';
    returnDoc.adminReview = {
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      warehouseAddress,
      instructions: instructions || 'Please pack the items carefully and ship via any courier (GHTK, Viettel Post, etc.). Then update the tracking code.',
    };
    returnDoc.timeline.push({
      status: 'APPROVED',
      note: `Approved by Admin. Return warehouse: ${warehouseAddress}`,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });

    if (order) {
      order.returnStatus = 'APPROVED';
      order.statusHistory.push({
        status: 'RETURN_APPROVED',
        note: `Return request approved. Waiting for customer shipment.`,
        updatedBy: req.user._id,
        updatedAt: new Date(),
      });
      await order.save();
    }

    await returnDoc.save();

    // Send Notification
    await sendNotification({
      recipientId: returnDoc.user,
      senderId: req.user._id,
      type: 'RETURN_APPROVED',
      title: 'Return Request Approved',
      message: `Your return request for order #${order._id.toString().slice(-6)} has been approved. Please follow instructions to return items.`,
      relatedId: returnDoc._id,
    });
  } else if (action === 'REJECT') {
    returnDoc.status = 'REJECTED';
    returnDoc.adminReview = {
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      rejectReason,
    };
    returnDoc.timeline.push({
      status: 'REJECTED',
      note: `Rejected by Admin. Reason: ${rejectReason}`,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });

    if (order) {
      order.returnStatus = 'REJECTED';
      order.statusHistory.push({
        status: 'RETURN_REJECTED',
        note: `Return request rejected. Reason: ${rejectReason}`,
        updatedBy: req.user._id,
        updatedAt: new Date(),
      });
      await order.save();
    }

    await returnDoc.save();

    // Send Notification
    await sendNotification({
      recipientId: returnDoc.user,
      senderId: req.user._id,
      type: 'RETURN_REJECTED',
      title: 'Return Request Rejected',
      message: `Your return request for order #${order._id.toString().slice(-6)} was rejected: ${rejectReason}`,
      relatedId: returnDoc._id,
    });
  }

  res.status(200).json(returnDoc);
});

// @desc    Update return tracking info by Customer
// @route   PUT /api/v1/returns/:id/tracking
// @access  Private (Customer)
export const updateReturnTracking = asyncHandler(async (req, res) => {
  const { carrier, trackingCode, note } = req.body;

  const returnDoc = await ReturnRequest.findById(req.params.id).populate('order');
  if (!returnDoc) {
    res.status(404);
    throw new Error('Return request not found');
  }

  if (
    returnDoc.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to update tracking info');
  }

  if (returnDoc.status !== 'APPROVED') {
    res.status(400);
    throw new Error('Tracking number can only be submitted for approved return requests');
  }

  returnDoc.status = 'RETURNING';
  returnDoc.returnTracking = {
    carrier,
    trackingCode,
    note,
    shippedAt: new Date(),
  };

  returnDoc.timeline.push({
    status: 'RETURNING',
    note: `Customer shipped items via ${carrier} (Tracking: ${trackingCode})`,
    updatedBy: req.user._id,
    updatedAt: new Date(),
  });

  await returnDoc.save();

  if (returnDoc.order) {
    returnDoc.order.statusHistory.push({
      status: 'RETURN_IN_TRANSIT',
      note: `Return package sent via ${carrier} (${trackingCode})`,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });
    await returnDoc.order.save();
  }

  res.status(200).json(returnDoc);
});

// @desc    Admin marks package received at warehouse
// @route   PUT /api/v1/returns/:id/receive
// @access  Private (Admin)
export const markReturnReceived = asyncHandler(async (req, res) => {
  const returnDoc = await ReturnRequest.findById(req.params.id);
  if (!returnDoc) {
    res.status(404);
    throw new Error('Return request not found');
  }

  if (!['APPROVED', 'RETURNING'].includes(returnDoc.status)) {
    res.status(400);
    throw new Error(`Cannot mark received from status ${returnDoc.status}`);
  }

  returnDoc.status = 'RECEIVED';
  returnDoc.timeline.push({
    status: 'RECEIVED',
    note: 'Warehouse received the return package. Inspecting goods.',
    updatedBy: req.user._id,
    updatedAt: new Date(),
  });

  await returnDoc.save();
  res.status(200).json(returnDoc);
});

// @desc    Admin completes return (refunded or exchanged + restock)
// @route   PUT /api/v1/returns/:id/complete
// @access  Private (Admin)
export const completeReturnRequest = asyncHandler(async (req, res) => {
  const { restock = true, note } = req.body;

  const returnDoc = await ReturnRequest.findById(req.params.id).populate('order');
  if (!returnDoc) {
    res.status(404);
    throw new Error('Return request not found');
  }

  if (['COMPLETED', 'REJECTED', 'CANCELLED'].includes(returnDoc.status)) {
    res.status(400);
    throw new Error(`Return request is already ${returnDoc.status}`);
  }

  const order = returnDoc.order;

  // Perform Restock if selected
  if (restock && order && order.orderItems && order.orderItems.length > 0) {
    for (const item of order.orderItems) {
      if (item.variantId) {
        await Product.updateOne(
          { _id: item._id, 'variants._id': item.variantId },
          {
            $inc: {
              'variants.$.countInStock': item.qty,
              qtySold: -item.qty,
            },
          },
        );
      } else {
        await Product.updateOne(
          { _id: item._id },
          {
            $inc: {
              countInStock: item.qty,
              qtySold: -item.qty,
            },
          },
        );
      }
    }
  }

  returnDoc.status = 'COMPLETED';
  returnDoc.restock = restock;
  returnDoc.completedAt = new Date();
  returnDoc.timeline.push({
    status: 'COMPLETED',
    note:
      note ||
      (returnDoc.type === 'RETURN_REFUND'
        ? 'Refund confirmed and processed by Admin. Process completed.'
        : 'Replacement exchange completed by Admin.'),
    updatedBy: req.user._id,
    updatedAt: new Date(),
  });

  await returnDoc.save();

  if (order) {
    if (returnDoc.type === 'RETURN_REFUND') {
      order.orderStatus = 'RETURNED';
    }
    order.returnStatus = 'COMPLETED';
    order.statusHistory.push({
      status: returnDoc.type === 'RETURN_REFUND' ? 'RETURNED' : 'EXCHANGE_COMPLETED',
      note: `Return/Exchange marked as completed by Admin`,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });
    await order.save();
  }

  // Send Notification to customer
  await sendNotification({
    recipientId: returnDoc.user,
    senderId: req.user._id,
    type: 'RETURN_COMPLETED',
    title:
      returnDoc.type === 'RETURN_REFUND'
        ? 'Refund Completed'
        : 'Exchange Completed',
    message:
      returnDoc.type === 'RETURN_REFUND'
        ? `Your refund for order #${order._id.toString().slice(-6)} has been completed.`
        : `Your exchange for order #${order._id.toString().slice(-6)} has been completed.`,
    relatedId: returnDoc._id,
  });

  res.status(200).json(returnDoc);
});

// @desc    Customer cancels return request
// @route   PUT /api/v1/returns/:id/cancel
// @access  Private (Customer)
export const cancelReturnRequest = asyncHandler(async (req, res) => {
  const returnDoc = await ReturnRequest.findById(req.params.id).populate('order');
  if (!returnDoc) {
    res.status(404);
    throw new Error('Return request not found');
  }

  if (returnDoc.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to cancel this request');
  }

  if (returnDoc.status !== 'PENDING_APPROVAL') {
    res.status(400);
    throw new Error('Can only cancel requests that are pending approval');
  }

  returnDoc.status = 'CANCELLED';
  returnDoc.timeline.push({
    status: 'CANCELLED',
    note: 'Cancelled by customer',
    updatedBy: req.user._id,
    updatedAt: new Date(),
  });

  await returnDoc.save();

  if (returnDoc.order) {
    returnDoc.order.returnStatus = 'NONE';
    returnDoc.order.statusHistory.push({
      status: 'RETURN_CANCELLED',
      note: 'Return request cancelled by customer',
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });
    await returnDoc.order.save();
  }

  res.status(200).json(returnDoc);
});
