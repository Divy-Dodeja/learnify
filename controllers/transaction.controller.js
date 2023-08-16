const _ = require('lodash');
const httpStatus = require('http-status');
const { transactionService, walletService } = require('../services');

const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const getTransactionsForInstructor = catchAsync(async (req, res) => {
  const { user } = req;
  const filters = _.pick(req.query, ['status']);
  filters.user = user._id;
  filters.instructor = true;
  const transactions = await transactionService.getTransactionsWithPopulateForInstructor(filters);
  return res.status(httpStatus.OK).json({ status: 'success', data: { transactions } });
});

const getTransactionByIdForInstructor = catchAsync(async (req, res) => {
  const { user } = req;
  const { transactionId } = req.params;
  const transaction = await transactionService.getTransactionById(transactionId, { user: user._id, status: 'withdrawn' });
  if (!transaction) {
    throw new ApiError('no transaction found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { transaction } });
});

const getTransactions = catchAsync(async (req, res) => {
  const filters = _.pick(req.query, ['transactionType', 'status']);
  const options = _.pick(req.query, ['page', 'limit', 'sort']);
  options.populate = [
    {
      path: 'user',
    },
  ];
  const transactions = await transactionService.getTransactionsWithPopulatePaginate(filters, options);
  return res.status(httpStatus.OK).json({ status: 'success', data: { transactions } });
});

const getTransactionById = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const transaction = await transactionService.getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError('no transaction found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { transaction } });
});

const updateTransactionById = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const transaction = await transactionService.updateTransactionById(transactionId, req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { transaction } });
});

const deleteTransactionById = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  await transactionService.deleteTransactionById(transactionId);
  return res.status(httpStatus.OK).json({ status: 'success', data: {}, message: 'transaction deleted!' });
});

const createTransactionForInstructor = catchAsync(async (req, res) => {
  const { body, user } = req;
  body.user = user._id;
  const wallet = await walletService.getWalletByFilter({ user: user._id });
  if (!wallet) {
    throw new ApiError('something went wrong with the wallet please contact the support team!', httpStatus.BAD_REQUEST);
  }
  body.amount = currentEarnings;
  body.transactionType = 'withdrawn';
  const transaction = await transactionService.createTransaction(body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { transaction } });
});

module.exports = {
  getTransactions,
  getTransactionById,
  deleteTransactionById,
  updateTransactionById,
  getTransactionsForInstructor,
  getTransactionByIdForInstructor,
  createTransactionForInstructor,
};
