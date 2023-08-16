const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Coupon } = require('../models');

const createCoupon = async (body) => {
  let coupon = await Coupon.findOne({ couponCode: body.couponCode });
  if (coupon) {
    throw new ApiError('coupon already exist with this name!', httpStatus.BAD_REQUEST);
  }
  coupon = new Coupon(body);
  await coupon.save();
  return coupon;
};

const getCoupons = async (filters = {}) => {
  return Coupon.find(filters);
};

const getCoupon = async (filters = {}) => {
  return Coupon.findOne(filters);
};

const getCouponById = async (id, filters = {}) => {
  return Coupon.findOne({ _id: id, ...filters });
};

const deleteCouponById = async (id, filters = {}) => {
  const coupon = await getCouponById(id, filters);
  if (!coupon) {
    throw new ApiError('no coupon found with this id!', httpStatus.BAD_REQUEST);
  }
  await coupon.delete();
  return true;
};

const updateCouponById = async (id, body, filters = {}) => {
  const coupon = await getCouponById(id, filters);
  if (!coupon) {
    throw new ApiError('no coupon found!', httpStatus.BAD_REQUEST);
  }
  Object.assign(coupon, { ...body });
  const newCoupon = await coupon.save();
  return newCoupon;
};
module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  deleteCouponById,
  updateCouponById,
  getCoupon,
};
