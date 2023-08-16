const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Page } = require('../models');

const createPage = async (body) => {
  const page = new Page(body);
  await page.save();
  return page;
};

const getPages = async (filters = {}) => {
  return Page.find(filters);
};

const getPagesWithPaginate = async (filters = {}, options = {}) => {
  return Page.paginate(filters, options);
};

const getPageById = async (id, filters = {}) => {
  return Page.findOne({ _id: id, ...filters });
};

const getPage = async (filters = {}) => {
  return Page.findOne(filters);
};

const deletePageById = async (id, filters = {}) => {
  const page = await getPageById(id, filters);
  if (!page) {
    throw new ApiError('no page found with this id!', httpStatus.BAD_REQUEST);
  }
  await page.delete();
  return true;
};

const updatePageById = async (id, body, filters = {}) => {
  const page = await getPageById(id, filters);
  if (!page) {
    throw new ApiError('no page found!', httpStatus.BAD_REQUEST);
  }
  Object.assign(page, { ...body });
  const newPage = await page.save();
  return newPage;
};
module.exports = {
  createPage,
  getPages,
  getPageById,
  deletePageById,
  updatePageById,
  getPagesWithPaginate,
  getPage,
};
