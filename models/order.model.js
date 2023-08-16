const mongoose = require('mongoose');
const { toJSON } = require('./plugin');

const { Schema } = mongoose;
const Course = require('./course.model');
const User = require('./user.model');
const Coupon = require('./coupon.model');

const orderSchema = new Schema(
  {
    user: User.schema,
    course: Course.schema,
    instructor: User.schema,
    totalPaid: {
      type: Number,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    coupon: Coupon.schema,
    status: {
      type: String,
      default: 'success',
      enum: ['success', 'rejected', 'pending', 'paid'],
    },
    rejectedReason: {
      type: String,
    },
    charges: [
      {
        name: String,
        value: String,
      },
    ],
    transactionId: {
      type: String,
    },
    enrollId: {
      type: mongoose.Types.ObjectId,
      ref: 'EnrollTransaction',
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(require('mongoose-paginate-v2'));

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
