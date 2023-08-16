const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { couponService, courseService } = require('../services');
const ApiError = require('../utils/ApiError');

const createCoupon = catchAsync(async (req, res) => {
  const { body } = req;
  const coupon = await couponService.createCoupon(body);
  return res.status(httpStatus.CREATED).json({ status: 'success', data: { coupon } });
});

const getCoupons = catchAsync(async (req, res) => {
  const coupons = await couponService.getCoupons({
    isDeleted: false,
  });
  return res.status(httpStatus.OK).json({ status: 'success', data: { coupons } });
});

const getCouponById = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  const coupon = await couponService.getCouponById({ _id: couponId });
  if (!coupon) {
    throw new ApiError('no coupon found with this id', httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { coupon } });
});

const updateCouponById = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  const { body } = req;
  const coupon = await couponService.updateCouponById(couponId, body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { coupon } });
});

const deleteCouponById = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  await couponService.deleteCouponById(couponId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {} });
});

const createCouponForInstructor = catchAsync(async (req, res) => {
  const { body, user } = req;
  body.isInstructorCreated = true;
  const course = await courseService.getCourseById(body.courseId, { primaryInstructor: user._id });
  if (!course) {
    throw new ApiError('no course found with this id!', httpStatus.BAD_REQUEST);
  }
  let coupon = await couponService.getCoupon({
    couponCode: body.couponCode,
    isInstructorCreated: true,
    courseId: course._id,
  });
  if (coupon) {
    throw new ApiError('coupon is already exist with this coupon!', httpStatus.BAD_REQUEST);
  }
  coupon = await couponService.createCoupon(body);
  return res.status(httpStatus.OK).send({ status: 'success', data: { coupon } });
});

const updateCouponByIdForInstructor = catchAsync(async (req, res) => {
  const { couponId } = req.params;

  const { body, user } = req;
  const coupon = await couponService.getCoupon({ _id: couponId });
  if (!coupon) {
    throw new ApiError('no coupon found with this id!', httpStatus.BAD_REQUEST);
  }
  const course = await courseService.getCourseById(course._id, { primaryInstructor: user._id });
  if (!course) {
    throw new ApiError('no course found with this id!', httpStatus.BAD_REQUEST);
  }
  if (coupon.couponCode !== body.couponCode) {
    throw new ApiError('you can not change coupon code once it created!', httpStatus.BAD_REQUEST);
  }
  coupon = await couponService.updateCouponById(coupon._id, body);
  return res.status(httpStatus.OK).send({ status: 'success', data: { coupon } });
});

const getCouponsForInstructor = catchAsync(async (req, res) => {
  const { user } = req;
  let courses = await courseService.getCourses({ primaryInstructor: user._id });
  courses = await courses.map((course) => course._id);
  const coupons = await couponService.getCoupons({ courseId: { $in: courses } });
  return res.status(httpStatus.OK).send({ status: 'success', data: { coupons } });
});

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  deleteCouponById,
  updateCouponById,
  updateCouponByIdForInstructor,
  createCouponForInstructor,
  getCouponsForInstructor,
};
