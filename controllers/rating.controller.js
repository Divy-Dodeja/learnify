const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { EnrollTransaction } = require('../models');
const { ratingService, courseService } = require('../services');
const ApiError = require('../utils/ApiError');

const createRating = catchAsync(async (req, res) => {
  const { body } = req;
  const rating = await ratingService.createRating(body);
  return res.status(httpStatus.CREATED).json({ status: 'success', data: { rating } });
});

const createRatingForUser = catchAsync(async (req, res) => {
  const { body, user } = req;
  const { courseId } = req.params;
  const enrollment = await EnrollTransaction.findOne({ courseId, userId: user._id });
  if (!enrollment) {
    throw new ApiError('you can not give rating where you not enrolled', httpStatus.BAD_REQUEST);
  }
  let rating = await ratingService.getRatingByFilter({ course: courseId, user: user._id });
  if (rating) {
    throw new ApiError('you can not give rating to a course twise', httpStatus.BAD_REQUEST);
  }
  rating = await ratingService.createRating({ ...body, user: user._id, course: courseId });
  return res.status(httpStatus.OK).json({ status: 'success', data: { rating } });
});

const getRatingByCourseId = catchAsync(async (req, res) => {
  const { user } = req;
  const { courseId } = req.params;
  const rating = await ratingService.getRatingById({ course: courseId, user: user._id });
  return res.status(httpStatus.OK).json({ status: 'success', data: { rating } });
});

const getRatings = catchAsync(async (req, res) => {
  const ratings = await ratingService.getRatingsWithPopulate({});
  return res.status(httpStatus.OK).json({ status: 'success', data: { ratings } });
});

const getRatingById = catchAsync(async (req, res) => {
  const { ratingId } = req.params;
  const rating = await ratingService.getSingleRating({ _id: ratingId, isDeleted: false });
  if (!rating) {
    throw new ApiError('no rating found with this id', httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { rating } });
});

const updateRatingById = catchAsync(async (req, res) => {
  const { ratingId } = req.params;
  const { body } = req;
  const rating = await ratingService.updateRatingById(ratingId, body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { rating } });
});

const deleteRatingById = catchAsync(async (req, res) => {
  const { ratingId } = req.params;
  await ratingService.deleteRatingById(ratingId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {} });
});

const getRatingsForAuthor = catchAsync(async (req, res) => {
  const { user } = req;
  let courses = await courseService.getCourses({ primaryInstructor: user._id });
  courses = await courses.map((course) => course._id);
  const ratings = await ratingService.getRatingsWithout({ course: { $in: courses } });
  return res.status(httpStatus.OK).json({ status: 'success', data: { ratings } });
});

module.exports = {
  createRating,
  getRatings,
  getRatingById,
  deleteRatingById,
  updateRatingById,
  getRatingByCourseId,
  createRatingForUser,
  getRatingsForAuthor,
};
