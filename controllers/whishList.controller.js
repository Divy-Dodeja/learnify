const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { whishListService } = require('../services');
const ApiError = require('../utils/ApiError');

const createWhishList = catchAsync(async (req, res) => {
  const { body } = req;
  const whishList = await whishListService.createWhishList(body);
  return res.status(httpStatus.CREATED).json({ status: 'success', data: { whishList } });
});

const getWhishLists = catchAsync(async (req, res) => {
  const whishLists = await whishListService.getWhishLists({
    isDeleted: false,
  });
  return res.status(httpStatus.OK).json({ status: 'success', data: { whishLists } });
});

const getWhishListById = catchAsync(async (req, res) => {
  const { whishListId } = req.params;
  const whishList = await whishListService.getSingleWhishList({ _id: whishListId, isDeleted: false });
  if (!whishList) {
    throw new ApiError('no whishList found with this id', httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { whishList } });
});

const updateWhishListById = catchAsync(async (req, res) => {
  const { whishListId } = req.params;
  const { body } = req;
  const whishList = await whishListService.updateWhishListById(whishListId, body);
  return res.status(httpStatus.ok).json({ status: 'success', data: { whishList } });
});

const deleteWhishListById = catchAsync(async (req, res) => {
  const { whishListId } = req.params;
  await whishListService.deleteWhishListById(whishListId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {} });
});

module.exports = {
  createWhishList,
  getWhishLists,
  getWhishListById,
  deleteWhishListById,
  updateWhishListById,
};
