import asyncHandler from '../middleware/asyncHandler.js';
import Notification from '../model/notificationModel.js';

// @desc get notification user
// GET /api/v1/notifications
// public
export const getNotifications = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const pageSize = 3;
  const page = Number(req.query.pageNumber) || 1;

  const [count, notifications] = await Promise.all([
    Notification.countDocuments({ recipient: myId }),
    Notification.find({ recipient: myId })
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize),
  ]);

  res.status(200).json({
    notifications,
    page,
    pages: Math.ceil(count / pageSize),
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
export const makeReadNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { $set: { isRead: true } },
    { new: true },
  );

  if (!notification) {
    res.status(404);
    throw new Error('Notification Not Found or Unauthorized');
  }
  res.status(200).json(notification);
});

// @desc Mark all notification as read
// PUT /api/v1/notifications/read-all
// public
export const makeAllReadNotification = asyncHandler(async (req, res) => {
  const myId = req.user._id;

  await Notification.updateMany(
    { recipient: myId, isRead: false },
    { $set: { isRead: true } },
  );

  res.status(200).json({ message: 'All notifications marked as read' });
});
