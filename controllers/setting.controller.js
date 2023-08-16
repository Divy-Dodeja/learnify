const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { settingService } = require('../services');

/**
 * get the settings of the site
 */
const getSettings = catchAsync(async (req, res) => {
  const setting = await settingService.getSetting();
  return res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      setting,
    },
  });
});

/**
 * update the setting of the site
 */
const updateSetting = catchAsync(async (req, res) => {
  const { body } = req;
  const setting = await settingService.updateSetting(body);
  return res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      setting,
    },
  });
});

module.exports = {
  getSettings,
  updateSetting,
};
