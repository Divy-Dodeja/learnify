const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
const ApiError = require('../utils/ApiError');

const createNotification = catchAsync(async (req, res) => {
  const { body } = req;
  const notification = await notificationService.createNotification(body);
  return res.status(httpStatus.CREATED).json({ status: 'success', data: { notification } });
});

const getNotificationsForInstructor = catchAsync(async (req, res) => {
  const { user } = req;
  const { isSeen } = req.query;
  const filters = {
    user: user._id,
  };
  if (isSeen) {
    filters.isSeen = isSeen;
  }

  const notifications = await notificationService.getNotifications(filters);
  return res.status(httpStatus.OK).json({ status: 'success', data: { notifications } });
});

const getNotificationsForAdmin = catchAsync(async (req, res) => {
  const { user } = req;
  const notifications = await notificationService.getNotifications({ isForAdmin: true, isSeen: false });
  return res.status(httpStatus.OK).json({ status: 'success', data: { notifications } });
});

const getNotificationsForAll = catchAsync(async (req, res) => {
  const { user } = req;
  const notifications = await notificationService.getNotifications({ isForAll: true, isSeen: false });
  return res.status(httpStatus.OK).json({ status: 'success', data: { notifications } });
});

const getNotifications = catchAsync(async (req, res) => {
  const notifications = await notificationService.getNotifications({
    isDeleted: false,
  });
  return res.status(httpStatus.OK).json({ status: 'success', data: { notifications } });
});

const getNotificationById = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await notificationService.getNotification({ _id: notificationId });
  if (!notification) {
    throw new ApiError('no notification found with this id', httpStatus.NOT_FOUND);
  }
  notification.isSeen = true;
  await notification.save();
  return res.status(httpStatus.OK).json({ status: 'success', data: { notification } });
});

const updateNotificationById = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  const { body } = req;
  const notification = await notificationService.updateNotificationById(notificationId, body);
  return res.status(httpStatus.ok).json({ status: 'success', data: { notification } });
});

const deleteNotificationById = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  await notificationService.deleteNotificationById(notificationId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {} });
});

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  deleteNotificationById,
  updateNotificationById,
  getNotificationsForInstructor,
  getNotificationsForAdmin,
  getNotificationsForAll,
};
