const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { LogTransaction } = require('../models');

const createLogTransaction = async (body) => {
  const logTransaction = new LogTransaction(body);
  await logTransaction.save();
  return logTransaction;
};

const getLogTransactions = async (filters = {}, options = {}) => {
  return LogTransaction.paginate(filters, options);
};

const getLogTransactionById = async (id, filters = {}) => {
  return LogTransaction.findOne({ _id: id, ...filters });
};

const deleteLogTransactionById = async (id, filters = {}) => {
  const logTransaction = await getLogTransactionById(id, filters);
  if (!logTransaction) {
    throw new ApiError('no logTransaction found with this id!', httpStatus.BAD_REQUEST);
  }
  await logTransaction.delete();
  return true;
};

const updateLogTransactionById = async (id, body, filters = {}) => {
  const logTransaction = await getLogTransactionById(id, filters);
  if (!logTransaction) {
    throw new ApiError('no logTransaction found!', httpStatus.BAD_REQUEST);
  }
  Object.assign(logTransaction, { ...body });
  const newLogTransaction = await logTransaction.save();
  return newLogTransaction;
};
module.exports = {
  createLogTransaction,
  getLogTransactions,
  getLogTransactionById,
  deleteLogTransactionById,
  updateLogTransactionById,
};
