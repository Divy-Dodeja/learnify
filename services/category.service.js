const httpStatus = require('http-status');

const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

const createCategory = async (body) => {
  const category = new Category(body);
  await category.save();
  return category;
};

/**
 * to get all the categories
 * @param {Object} filters filters to get the categories
 */
const getAllCategories = async (filters = {}) => {
  return Category.find(filters);
};

const getCategoryById = async (id, filters = {}) => {
  return Category.findOne({ _id: id, ...filters });
};

/**
 * to get single category by filter
 * @param {Object} filters filters to get the categories
 */
const getSingleCategory = async (filters = {}) => {
  return Category.findOne(filters);
};

/**
 * to update the existing category
 * @param {ObjectId} id Objectid of category
 * @param {Object} body body of the category to update
 */
const updateCategoryById = async (id, body, filters = {}) => {
  const category = await getCategoryById(id, filters);
  if (!category) {
    throw new ApiError('no category found with this id', httpStatus.BA);
  }
  Object.assign(category, { ...body });
  const newCategory = await category.save();
  return newCategory;
};

/**
 * to soft delete the category
 * @param {ObjectId} id ObjectId Of category
 */
const deleteCategoryById = async (id, filters = {}) => {
  const category = await getCategoryById(id, filters);
  if (!category) {
    throw new ApiError('no category found with this id', httpStatus.BA);
  }
  await category.remove();
  return true;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  getSingleCategory,
  updateCategoryById,
  deleteCategoryById,
};
