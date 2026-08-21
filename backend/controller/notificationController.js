import asyncHandler from '../middleware/asyncHandler.js';
import Notification from '../model/notificationModel.js';

// @desc get notification user
// GET /api/v1/notifications
// public
export const getNotifications = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ recipient: myId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ recipient: myId }),
  ]);

  res.status(200).json({
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// @desc get count notification unread
// GET /api/v1/notifications/unread-count
// public
export const getUnreadNotification = asyncHandler(async (req, res) => {
  const myId = req.user._id;

  const unreadCount = await Notification.countDocuments({
    recipient: myId,
    isRead: false,
  });

  res.status(200).json(unreadCount);
});

// @desc Mark a notification as read
// PUT /api/v1/notifications/:id/read
// public
export const makeReadNotification = asyncHandler(async (req, res) => {});

// @desc Mark all notification as read
// PUT /api/v1/notifications/read-all
// public
export const makeAllReadNotification = asyncHandler(async (req, res) => {});
