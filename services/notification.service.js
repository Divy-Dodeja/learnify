const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Notification } = require('../models');

const createNotification = async (body) => {
  const notification = new Notification(body);
  await notification.save();
  return notification;
};

const getNotifications = async (filters = {}, options = {}) => {
  return Notification.find(filters).sort('-createdAt');
};
const getNotification = async (filters = {}) => {
  return Notification.findOne(filters);
};

const getNotificationsPaginate = async (filters = {}, options = {}) => {
  return Notification.paginate(filters, options);
};

const getNotificationById = async (id, filters = {}) => {
  return Notification.findOne({ _id: id, ...filters });
};

const deleteNotificationById = async (id, filters = {}) => {
  const notification = await getNotificationById(id, filters);
  if (!notification) {
    throw new ApiError('no notification found with this id!', httpStatus.BAD_REQUEST);
  }
  await notification.delete();
  return true;
};

const updateNotificationById = async (id, body, filters = {}) => {
  const notification = await getNotificationById(id, filters);
  if (!notification) {
    throw new ApiError('no notification found!', httpStatus.BAD_REQUEST);
  }
  Object.assign(notification, { ...body });
  const newNotification = await notification.save();
  return newNotification;
};
module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  deleteNotificationById,
  updateNotificationById,
  getNotificationsPaginate,
  getNotification,
};
