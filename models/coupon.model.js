const mongoose = require('mongoose');

const { Schema } = mongoose;
const { toJSON } = require('./plugin');

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
    },
    isGlobale: {
      type: Boolean,
      default: false,
    },
    isInstructorCreated: {
      type: Boolean,
      default: true,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
    limit: {
      type: Number,
      default: 10,
    },
    used: {
      type: Number,
      default: 0,
    },
    isUnlimited: {
      type: Boolean,
      default: false,
    },
    couponType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    value: {
      type: Number,
      default: 10,
    },
    expireAt: {
      type: Date,
      default: Date.now() + 3 * 24 * 60 * 60 * 1000,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.plugin(toJSON);

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
