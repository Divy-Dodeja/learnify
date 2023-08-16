const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bankMethodService } = require('../services');
const _ = require('lodash');

const createBankMethod = catchAsync(async (req, res) => {
  const { user, body } = req;
  body.user = user._id;
  const bankMethod = await bankMethodService.createMethod(body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { bankMethod } });
});

const getBankMethodsForUser = catchAsync(async (req, res) => {
  const { user } = req;
  const bankMethods = await bankMethodService.getBankMethods({ user: user._id });
  return res.status(httpStatus.OK).json({ status: 'success', data: { bankMethods } });
});

const getBankMethodForUser = catchAsync(async (req, res) => {
  const { user } = req;
  const { methodId } = req.params;
  const bankMethod = await bankMethodService.getBankMethodByFilter({ _id: methodId, user: user._id });
  if (!bankMethod) {
    throw new ApiError('no bank method found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { bankMethod } });
});

const getBankMethods = catchAsync(async (req, res) => {
  const { query } = req;
  const filters = _.pick(query, ['user']);
  const bankMethods = await bankMethodService.getBankMethods(filters);
  return res.status(httpStatus.OK).json({ status: 'success', data: { bankMethods } });
});

const getBankMethodById = catchAsync(async (req, res) => {
  const { methodId } = req.params;
  const bankMethod = await bankMethodService.getBankMethodByFilter({ _id: methodId });
  return res.status(httpStatus.OK).json({ status: 'success', data: { bankMethod } });
});

const updateBankMethodById = catchAsync(async (req, res) => {
  const { body } = req;
  const { methodId } = req.params;
  const bankMethod = await bankMethodService.updateBankMethodById(methodId, body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { bankMethod } });
});

const updateBankMethodByIdForUser = catchAsync(async (req, res) => {
  const { methodId } = req.params;
  const { body, user } = req;
  const bankMethod = await bankMethodService.updateBankMethodById(methodId, body, { user: user._id });
  return res.status(httpStatus.OK).send({ status: 'success', data: { bankMethod } });
});

const deleteBankMethodById = catchAsync(async (req, res) => {
  const { methodId } = req.params;
  await bankMethodService.deleteBankMethod(methodId);
  return res.status(httpStatus.OK).json({ status: 'success', data: {}, message: 'bankMethod deleted successfully' });
});

const deleteBankMethodByIdForUser = catchAsync(async (req, res) => {
  const { user } = req;
  const { methodId } = req.params;
  await bankMethodService.deleteBankMethod(methodId, { user: user._id });
  return res.status(httpStatus.OK).send({ status: 'success', data: {}, message: 'bank account deleted successfully!' });
});

const setCurrentBankAccountDefault = catchAsync(async (req, res) => {
  const { methodId } = req.params;
  const { user } = req;
  const bankAccount = await bankMethodService.getBankMethodByFilter({ _id: methodId, user: user._id });
  if (!user) {
    throw new ApiError('no bank account found with this id!', httpStatus.BAD_REQUEST);
  }
  if (user.defaultBankAccount) {
    if (user.defaultBankAccount.toString() === bankAccount._id.toString()) {
      throw new ApiError('bank account is already your default account!', httpStatus.BAD_REQUEST);
    }
  }

  user.defaultBankAccount = bankAccount._id;
  await user.save();
  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      bankAccount,
    },
  });
});

module.exports = {
  getBankMethods,
  getBankMethodForUser,
  getBankMethodsForUser,
  createBankMethod,
  getBankMethodById,
  updateBankMethodById,
  deleteBankMethodById,
  setCurrentBankAccountDefault,
  updateBankMethodByIdForUser,
  deleteBankMethodByIdForUser,
};
