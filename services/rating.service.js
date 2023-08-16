const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Rating } = require('../models');

const createRating = async (body) => {
  const rating = new Rating(body);
  await rating.save();
  return rating;
};

const getRatings = async (filters = {}, options = {}) => {
  return Rating.paginate(filters, options);
};

const getRatingsWithout = async (filters = {}) => {
  return Rating.find(filters).populate('user').populate('course');
};

const getRatingsWithPopulate = async (filters = {}) => {
  return Rating.find(filters).populate('user').populate('course');
};

const getRatingById = async (id, filters = {}) => {
  return Rating.findOne({ _id: id, ...filters });
};

const getRatingByFilter = async (filters = {}) => {
  return Rating.findOne(filters);
};

const deleteRatingById = async (id, filters = {}) => {
  const rating = await getRatingById(id, filters);
  if (!rating) {
    throw new ApiError('no rating found with this id!', httpStatus.BAD_REQUEST);
  }
  await rating.delete();
  return true;
};

const updateRatingById = async (id, body, filters = {}) => {
  const rating = await getRatingById(id, filters);
  if (!rating) {
    throw new ApiError('no rating found!', httpStatus.BAD_REQUEST);
  }
  Object.assign(rating, { ...body });
  const newRating = await rating.save();
  return newRating;
};
module.exports = {
  createRating,
  getRatings,
  getRatingById,
  deleteRatingById,
  updateRatingById,
  getRatingByFilter,
  getRatingsWithPopulate,
  getRatingsWithout,
};
