const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Section } = require('../models');

const createSection = async (body) => {
  const section = new Section(body);
  await section.save();
  return section;
};

const getSectionsPaginated = async (filters = {}, options = {}) => {
  return Section.paginate(filters, options);
};

const getSections = async (filters = {}) => {
  return Section.find(filters);
};

const getSectionsWithOrderSort = async (filters = {}) => {
  return Section.find(filters).sort('order');
};

const getSectionById = async (id, filters = {}) => {
  return Section.findOne({ _id: id, ...filters });
};

const updateSectionById = async (id, body, filters = {}) => {
  const section = await getSectionById(id, filters);
  if (!section) {
    throw new ApiError('no section found with this id!', httpStatus.BAD_REQUEST);
  }
  Object.assign(section, { ...body });
  await section.save();
  return section;
};
const deleteSectionById = async (id, filters = {}) => {
  const section = await getSectionById(id, filters);
  if (!section) {
    throw new ApiError('no section found with this id!', httpStatus.BAD_REQUEST);
  }
  await section.delete();
  return true;
};

module.exports = {
  createSection,
  getSectionsPaginated,
  getSections,
  getSectionById,
  updateSectionById,
  deleteSectionById,
  getSectionsWithOrderSort,
};
