const httpStatus = require('http-status');
const { SiteWallet, Transaction } = require('../models');
const ApiError = require('../utils/ApiError');

const updateTotalWallet = async (value, course, order, adminPercentage) => {
  const siteWallet = await SiteWallet.findOne({});
  if (!siteWallet) {
    throw new ApiError('something went wrong please try again after sometime!', httpStatus.INTERNAL_SERVER_ERROR);
  }
  await SiteWallet.findOneAndUpdate({
    $inc: { totalEarnings: value },
  });
  await Transaction.create({
    admin: true,
    course,
    transactionType: 'paid',
    order,
    status: 'paid',
    paidAt: Date.now(),
    amount: adminPercentage,
  });
  return true;
};

const updateTotalWidthdrawnWallet = async (value) => {
  const siteWallet = await SiteWallet.findOne({});
  if (!siteWallet) {
    throw new ApiError('something went wrong please try again after sometime!', httpStatus.INTERNAL_SERVER_ERROR);
  }
  await SiteWallet.findOneAndUpdate({
    $inc: { totalWithdrawns: value },
  });
  return true;
};

const updateCurentEarningsWallet = async (value) => {
  const siteWallet = await SiteWallet.findOne({});
  if (!siteWallet) {
    throw new ApiError('something went wrong please try again after sometime!', httpStatus.INTERNAL_SERVER_ERROR);
  }
  await SiteWallet.findOneAndUpdate({
    $inc: { currentEarnings: value },
  });
  return true;
};

const updateAdminTotalWallet = async (value) => {
  const siteWallet = await SiteWallet.findOne({});
  if (!siteWallet) {
    throw new ApiError('something went wrong please try again after sometime!', httpStatus.INTERNAL_SERVER_ERROR);
  }
  await SiteWallet.findOneAndUpdate({
    $inc: { adminEarnings: value },
  });
  return true;
};

const resetCurrent = async (v) => {
  const siteWallet = await SiteWallet.findOne({});
  if (!siteWallet) {
    throw new ApiError('something went wrong please try again after sometime!', httpStatus.INTERNAL_SERVER_ERROR);
  }
  await SiteWallet.findOneAndUpdate({
    currentEarnings: 0,
  });
  return true;
};

module.exports = {
  updateCurentEarningsWallet,
  updateTotalWallet,
  updateTotalWidthdrawnWallet,
  updateAdminTotalWallet,
  resetCurrent,
};
