const mongoose = require('mongoose');
const { Schema } = mongoose;

const bankMethodsSchema = new Schema(
  {
    bankName: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const BankMethod = mongoose.model('BankMethod', bankMethodsSchema);

module.exports = BankMethod;
