const httpStatus = require('http-status');
const { Wallet, Transaction } = require('../models');
const ApiError = require('../utils/ApiError');

const createWallet = async (body) => {
  const wallet = new Wallet(body);
  await wallet.save();
  return wallet;
};

const getWalletById = async (id, filters = {}) => {
  return Wallet.findOne({ _id: id, ...filters });
};

const getWalletByFilter = async (filters = {}) => {
  return Wallet.findOne(filters);
};

const getWalletsPaginate = async (filters = {}, options = {}) => {
  return Wallet.paginate(filters, options);
};
const getWallets = async (filters = {}) => {
  return Wallet.find(filters);
};

const updateWalletById = async (id, body, filters = {}) => {
  const wallet = await getWalletById(id, filters);
  if (!wallet) {
    throw new ApiError('no wallet found with this id!', httpStatus.BAD_REQUEST);
  }
  Object.assign(wallet, { ...body });
  const newWallet = await wallet.save();
  return newWallet;
};

const addMoneyToWallet = async (id, amount, course, order, instructor = true) => {
  console.log('amount===', amount);
  const wallet = await getWalletByFilter({ _id: id });
  wallet.currentEarnings += amount;
  wallet.totalEarnings += amount;
  const transaction = await Transaction.create({
    transactionType: 'paid',
    user: wallet.user,
    amount,
    status: 'paid',
    paidAt: Date.now(),
    course,
    order,
    instructor,
  });
  return wallet.save();
};

const updateWalletByUser = async (user, body) => {
  const wallet = await getWalletByFilter({ user: user._id });
  if (!wallet) {
    throw new ApiError('no wallet found with this id!', httpStatus.BAD_REQUEST);
  }
  Object.assign(wallet, { ...body });
  const newWallet = await wallet.save();
  return newWallet;
};

module.exports = {
  createWallet,
  getWalletById,
  getWalletByFilter,
  getWallets,
  updateWalletById,
  updateWalletByUser,
  getWalletsPaginate,
  addMoneyToWallet,
};
