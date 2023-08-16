const mongoose = require('mongoose');
const { Schema } = mongoose;

const siteWalletSchema = new Schema(
  {
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalWithdrawns: {
      type: Number,
      default: 0,
    },
    currentEarnings: {
      type: Number,
      default: 0,
    },
    adminEarnings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const SiteWallet = mongoose.model('SiteWallet', siteWalletSchema);

module.exports = SiteWallet;
