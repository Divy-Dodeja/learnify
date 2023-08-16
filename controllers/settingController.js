const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const { Setting } = require('../models');

const updateSiteSetting = catchAsync(async (req, res) => {
  const { body } = req;
  const setting = await Setting.findOneAndUpdate({}, body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { setting } });
});

const getSiteSetting = catchAsync(async (req, res) => {
  const setting = await Setting.findOne({});
  return res.status(httpStatus.OK).json({ status: 'success', data: { setting } });
});

module.exports = {
  getSiteSetting,
  updateSiteSetting,
};
