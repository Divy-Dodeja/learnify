const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const ApiError = require('../utils/ApiError');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { category } });
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories({});
  return res.status(httpStatus.OK).json({ status: 'success', data: { categories } });
});

const getCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.getSingleCategory({ _id: id });
  if (!category) {
    throw new ApiError('no category found with this id', httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { category } });
});

const getCategoryBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const category = await categoryService.getSingleCategory({ slug });
  if (!category) {
    throw new ApiError('no category found with this id', httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { category } });
});

const updateCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const category = await categoryService.updateCategoryById(id, body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { category } });
});

const deleteCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  await categoryService.deleteCategoryById(id);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {} });
});

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  deleteCategoryById,
  updateCategoryById,
  createCategory,
};
