const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { WatchTransaction } = require('../models');

const createWatchTransaction = async (body) => {
  const watchTransaction = new WatchTransaction(body);
  return watchTransaction.save();
};

const getWatchTransactions = async (filters = {}) => {
  return WatchTransaction.find(filters);
};

const getWatchTransactionsPaginated = async (filters = {}, options = {}) => {
  return WatchTransaction.paginate(filters, options);
};

const getWatchTransactionById = async (id, filters = {}) => {
  return WatchTransaction.findOne({ _id: id, ...filters });
};

const getWatchTransaction = async (filters = {}) => {
  return WatchTransaction.findOne({ ...filters });
};

const updateWatchTransactionById = async (id, body, filters = {}) => {
  const watchTransaction = await getWatchTransactionById(id, filters);
  if (!watchTransaction) {
    throw new ApiError('no watchTransaction Found with this id!', httpStatus.BAD_REQUEST);
  }
  Object.assign(watchTransaction, { ...body });
  return watchTransaction.save();
};

const deleteTransactionById = async (id, filters = {}) => {
  const watchTransaction = await getWatchTransactionById(id, filters);
  if (!watchTransaction) {
    throw new ApiError('no watchTransaction Found with this id!', httpStatus.BAD_REQUEST);
  }
  await watchTransaction.remove();
  return true;
};

module.exports = {
  createWatchTransaction,
  getWatchTransactionById,
  getWatchTransactions,
  getWatchTransactionsPaginated,
  updateWatchTransactionById,
  deleteTransactionById,
  getWatchTransaction,
};
