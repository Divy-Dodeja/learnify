const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { localizationService } = require('../services');

const createLocalization = catchAsync(async (req, res) => {
  const localization = await localizationService.createLocalization(req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { localization } });
});

const getLocalizations = catchAsync(async (req, res) => {
  const localizations = await localizationService.getLocalizations();
  return res.status(httpStatus.OK).json({ status: 'success', data: { localizations } });
});

const getLocalizationById = catchAsync(async (req, res) => {
  const { localizationId } = req.params;
  const localization = await localizationService.getLocalizationById(localizationId);
  return res.status(httpStatus.OK).json({ status: 'success', data: { localization } });
});

const updateLocalizationById = catchAsync(async (req, res) => {
  const { localizationId } = req.params;
  const localization = await localizationService.updateLocalizationById(localizationId, req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { localization } });
});

const deleteLocalizationById = catchAsync(async (req, res) => {
  const { localizationId } = req.params;
  await localizationService.deleteLocalizationById(localizationId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {}, message: 'deleted successfully!' });
});

module.exports = {
  getLocalizations,
  getLocalizationById,
  updateLocalizationById,
  deleteLocalizationById,
  createLocalization,
};
