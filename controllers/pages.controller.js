const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { pageService } = require('../services');
const ApiError = require('../utils/ApiError');

const createPage = catchAsync(async (req, res) => {
  const { body } = req;
  const page = await pageService.createPage(body);
  return res.status(httpStatus.CREATED).json({ status: 'success', data: { page } });
});

const getPages = catchAsync(async (req, res) => {
  const pages = await pageService.getPages({ isAvailable: true });
  return res.status(httpStatus.OK).json({ status: 'success', data: { pages } });
});

const getPageById = catchAsync(async (req, res) => {
  const { pageId } = req.params;
  const page = await pageService.getPageById({ _id: pageId });
  if (!page) {
    throw new ApiError('no page found with this id', httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { page } });
});
const getPageBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const page = await pageService.getPage({ slug, isAvailable: true });
  if (!page) {
    throw new ApiError('no page found with this slug', httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { page } });
});

const updatePageById = catchAsync(async (req, res) => {
  const { pageId } = req.params;
  const { body } = req;
  const page = await pageService.updatePageById(pageId, body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { page } });
});

const deletePageById = catchAsync(async (req, res) => {
  const { pageId } = req.params;
  await pageService.deletePageById(pageId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {} });
});

module.exports = {
  createPage,
  getPages,
  getPageById,
  deletePageById,
  updatePageById,
  getPageBySlug,
};
