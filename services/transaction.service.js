const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Transaction } = require('../models');

const createTransaction = async (body) => {
  const transaction = new Transaction(body);
  return transaction.save();
};

const getTransactions = async (filters = {}) => {
  return Transaction.find(filters);
};

const getTransactionsWithPopulate = async (filters = {}) => {
  return Transaction.find(filters).populate('user');
};

const getTransactionsWithPopulatePaginate = async (filters = {}, options = {}) => {
  return Transaction.paginate(filters, options);
};
const getTransactionsWithPopulateForInstructor = async (filters = {}) => {
  return Transaction.find(filters).populate('user').populate('order').populate('course');
};

const getTransactionById = async (id, filters = {}) => {
  return Transaction.findOne({ _id: id, ...filters });
};

const updateTransactionById = async (id, body, filters = {}) => {
  const transaction = await getTransactionById(id, filters);
  if (!transaction) {
    throw new ApiError('no transaction found with this id!', httpStatus.BAD_REQUEST);
  }
  Object.assign(transaction, { ...body });
  return transaction.save();
};

const deleteTransactionById = async (id, filters = {}) => {
  const transaction = await getTransactionById(id, filters);
  if (!transaction) {
    throw new ApiError('no transaction found with this id!', httpStatus.BAD_REQUEST);
  }
  await transaction.remove();
  return true;
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
  getTransactionsWithPopulate,
  getTransactionsWithPopulateForInstructor,
  getTransactionsWithPopulatePaginate,
};
