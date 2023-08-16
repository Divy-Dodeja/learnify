const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { orderService } = require('../services');
const _ = require('lodash');

const createOrderForUser = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { user, body } = req;
  const { coupon } = req.query;
  body.courseId = courseId;
  const order = await orderService.createOrderForUser(user, body, coupon);
  return res.status(httpStatus.OK).json({ status: 'success', data: { order } });
});

const getOrders = catchAsync(async (req, res) => {
  const filters = _.pick(req.query, ['status', 'userId']);
  const orders = await orderService.getOrders(filters);
  return res.status(httpStatus.OK).json({ status: 'success', data: { orders } });
});

const getOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.getOrderById(orderId);
  if (!order) {
    throw new ApiError('no order found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { order } });
});

const getOrderByIdForUser = catchAsync(async (req, res) => {
  const { user } = req;
  const { orderId } = req.params;
  const order = await orderService.getOrderById(orderId, { 'user._id': user._id });
  if (!order) {
    throw new ApiError('no order found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { order } });
});

const updateOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.updateOrderById(orderId, req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { order } });
});

const deleteOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  await orderService.deleteOrderById(orderId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {}, message: 'order deleted!' });
});

const getOrderDetailForPurchase = catchAsync(async (req, res) => {
  const { query } = req;
  const { courseId } = req.params;
  const order = await orderService.getOrderDetailsForPurchase(courseId, query);
  return res.status(httpStatus.OK).json({ status: 'success', data: { order } });
});

const getOrdersForUser = catchAsync(async (req, res) => {
  const { user } = req;
  const orders = await orderService.getOrders({ 'user._id': user._id, status: { $in: ['paid'] } });
  return res.status(httpStatus.OK).json({ status: 'success', data: { orders } });
});

module.exports = {
  getOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  createOrderForUser,
  getOrderDetailForPurchase,
  getOrdersForUser,
  getOrderByIdForUser,
};
