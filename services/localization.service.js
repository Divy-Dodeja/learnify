const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Localization } = require('../models');

const getLocalizations = async (filters = {}) => {
  return Localization.find(filters);
};

const createLocalization = async (body) => {
  const localization = new Localization(body);
  return localization.save();
};

const getLocalizationById = async (id, filters = {}) => {
  return Localization.findOne({ _id: id, ...filters });
};

const updateLocalizationById = async (id, body, filters = {}) => {
  const localization = await getLocalizationById(id, filters);
  if (!localization) {
    throw new ApiError('no localization found with this id!', httpStatus.BAD_REQUEST);
  }
  Object.assign(localization, { ...body });
  return localization.save();
};

const deleteLocalizationById = async (id, filters = {}) => {
  const localization = await getLocalizationById(id, filters);
  if (!localization) {
    throw new ApiError('no localization found with this id!', httpStatus.BAD_REQUEST);
  }
  await localization.remove();
  return true;
};

module.exports = {
  getLocalizations,
  createLocalization,
  getLocalizationById,
  deleteLocalizationById,
  updateLocalizationById,
};
