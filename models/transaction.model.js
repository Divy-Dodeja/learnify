const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const { toJSON } = require('./plugin');

const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    transactionType: {
      type: String,
      enum: ['withdrawn', 'paid'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    admin: {
      type: Boolean,
      default: false,
    },
    instructor: {
      type: Boolean,
      default: false,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
    order: {
      type: mongoose.Types.ObjectId,
      ref: 'Order',
    },
    amount: {
      type: Number,
    },
    paymentType: {
      type: String,
    },
    status: {
      type: String,
      enum: ['rejected', 'paid', 'pending'],
      default: 'pending',
    },
    bankMethod: {
      type: mongoose.Types.ObjectId,
      ref: 'BankMethod',
    },
    referenceId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    rejectReason: {
      type: String,
    },
  },
  { timestamps: true }
);

transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
