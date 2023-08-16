const httpStatus = require('http-status');
const { BankMethod } = require('../models');
const ApiError = require('../utils/ApiError');

const createMethod = async (body) => {
  const bankMethod = new BankMethod(body);
  return bankMethod.save();
};

const getBankMethods = async (filters = {}) => {
  return BankMethod.find(filters).populate('user');
};

const getBankMethodByFilter = async (filters = {}) => {
  return BankMethod.findOne(filters);
};

const updateBankMethodById = async (id, body, filter = {}) => {
  const bankMethod = await getBankMethodByFilter({ _id: id, ...filter });
  if (!bankMethod) {
    throw new ApiError('no bank method found with this id!', httpStatus.BAD_REQUEST);
  }
  Object.assign(bankMethod, { ...body });
  return bankMethod.save();
};

const deleteBankMethod = async (id, filter = {}) => {
  const bankMethod = await getBankMethodByFilter({ _id: id, ...filter });
  if (!bankMethod) {
    throw new ApiError('no bank method found with this id!', httpStatus.BAD_REQUEST);
  }
  return bankMethod.remove();
};

module.exports = {
  createMethod,
  getBankMethodByFilter,
  getBankMethods,
  updateBankMethodById,
  deleteBankMethod,
};
