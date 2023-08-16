const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Setting } = require('../models');

const createSetting = async (body) => {
  const setting = new Setting(body);
  await setting.save();
  return setting;
};

const getSettings = async (filters = {}, options = {}) => {
  return Setting.paginate(filters, options);
};

const getSettingById = async (id, filters = {}) => {
  return Setting.findOne({ _id: id, ...filters });
};

const updateSettingById = async (id, body, filters = {}) => {
  const setting = await getSettingById(id, filters);
  if (!setting) {
    throw new ApiError('no setting found!', httpStatus.BAD_REQUEST);
  }
  Object.assign(setting, { ...body });
  const newSetting = await setting.save();
  return newSetting;
};
module.exports = {
  createSetting,
  getSettings,
  getSettingById,

  updateSettingById,
};
