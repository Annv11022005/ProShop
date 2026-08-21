import asyncHandler from '../middleware/asyncHandler.js';
import Notification from '../model/notificationModel.js';

// @desc get notification user
// GET /api/v1/notifications
// public
export const getNotifications = asyncHandler(async (req, res) => {});

// @desc get count notification unread
// GET /api/v1/notifications/unread-count
// public
export const getUnreadNotification = asyncHandler(async (req, res) => {});

// @desc Mark a notification as read
// PUT /api/v1/notifications/:id/read
// public
export const makeReadNotification = asyncHandler(async (req, res) => {});

// @desc Mark all notification as read
// PUT /api/v1/notifications/read-all
// public
export const makeAllReadNotification = asyncHandler(async (req, res) => {});
