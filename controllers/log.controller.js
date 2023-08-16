const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { logTransactionService } = require('../services');
const ApiError = require('../utils/ApiError');

const createLogTransaction = catchAsync(async (req, res) => {
  const { body } = req;
  const logTransaction = await logTransactionService.createLogTransaction(body);
  return res.status(httpStatus.CREATED).json({ status: 'success', data: { logTransaction } });
});

const getLogTransactions = catchAsync(async (req, res) => {
  const logTransactions = await logTransactionService.getLogTransactions({
    isDeleted: false,
  });
  return res.status(httpStatus.OK).json({ status: 'success', data: { logTransactions } });
});

const getLogTransactionById = catchAsync(async (req, res) => {
  const { logTransactionId } = req.params;
  const logTransaction = await logTransactionService.getSingleLogTransaction({ _id: logTransactionId, isDeleted: false });
  if (!logTransaction) {
    throw new ApiError('no logTransaction found with this id', httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { logTransaction } });
});

const updateLogTransactionById = catchAsync(async (req, res) => {
  const { logTransactionId } = req.params;
  const { body } = req;
  const logTransaction = await logTransactionService.updateLogTransactionById(logTransactionId, body);
  return res.status(httpStatus.ok).json({ status: 'success', data: { logTransaction } });
});

const deleteLogTransactionById = catchAsync(async (req, res) => {
  const { logTransactionId } = req.params;
  await logTransactionService.deleteLogTransactionById(logTransactionId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {} });
});

module.exports = {
  createLogTransaction,
  getLogTransactions,
  getLogTransactionById,
  deleteLogTransactionById,
  updateLogTransactionById,
};
