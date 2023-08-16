const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { WhishList } = require('../models');

const createWhishList = async (body) => {
  const whishList = new WhishList(body);
  await whishList.save();
  return whishList;
};

const getWhishLists = async (filters = {}, options = {}) => {
  return WhishList.paginate(filters, options);
};

const getWhishListById = async (id, filters = {}) => {
  return WhishList.findOne({ _id: id, ...filters });
};

const deleteWhishListById = async (id, filters = {}) => {
  const whishList = await getWhishListById(id, filters);
  if (!whishList) {
    throw new ApiError('no whishList found with this id!', httpStatus.BAD_REQUEST);
  }
  await whishList.delete();
  return true;
};

const updateWhishListById = async (id, body, filters = {}) => {
  const whishList = await getWhishListById(id, filters);
  if (!whishList) {
    throw new ApiError('no whishList found!', httpStatus.BAD_REQUEST);
  }
  Object.assign(whishList, { ...body });
  const newWhishList = await whishList.save();
  return newWhishList;
};
module.exports = {
  createWhishList,
  getWhishLists,
  getWhishListById,
  deleteWhishListById,
  updateWhishListById,
};
