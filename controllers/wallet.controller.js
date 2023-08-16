const httpStatus = require('http-status');
const { walletService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const getWallet = catchAsync(async (req, res) => {
  const { user } = req;
  let wallet = await walletService.getWalletByFilter({ user: user._id });
  if (!wallet) {
    wallet = await walletService.createWallet({ user: user._id });
  }
  return res.status(httpStatus.OK).send(wallet);
});

const updateWallet = catchAsync(async (req, res) => {
  const { user, body } = req;
  const wallet = await walletService.updateWalletByUser(user, body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { wallet } });
});

const getWallets = catchAsync(async (req, res) => {
  const wallets = await walletService.getWallets();
  return res.status(httpStatus.OK).json({ status: 'success', data: { wallets } });
});

const updateWalletById = catchAsync(async (req, res) => {
  const { walletId } = req.params;
  const wallet = await walletService.updateWalletById(walletId, req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { wallet } });
});

const getWalletById = catchAsync(async (req, res) => {
  const { walletId } = req.params;
  const wallet = await walletService.getWalletById(walletId);
  if (!wallet) {
    throw new ApiError('no wallet found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { wallet } });
});

module.exports = {
  getWallet,
  updateWallet,
  getWallets,
  updateWalletById,
  getWalletById,
};
