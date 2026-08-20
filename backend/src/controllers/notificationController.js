const NotificationModel = require('../models/NotificationModel');
const asyncHandler = require('../utils/asyncHandler');

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await NotificationModel.getByUserId(req.user.id);
  res.status(200).json({
    success: true,
    data: notifications
  });
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  await NotificationModel.markAsRead(notificationId, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Notification marked as read'
  });
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await NotificationModel.markAllAsRead(req.user.id);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

const createNotification = asyncHandler(async (req, res) => {
  const { userId, title, message, type } = req.body;
  const notificationId = await NotificationModel.create({ userId, title, message, type });

  res.status(201).json({
    success: true,
    message: 'Notification sent successfully',
    data: { id: notificationId }
  });
});

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification
};
