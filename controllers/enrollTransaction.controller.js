const httpStatus = require('http-status');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { enrollTransactionService, courseService, userService } = require('../services');
const ApiError = require('../utils/ApiError');
const Lecture = require('../models/lecture.model');

const createEnrollTransaction = catchAsync(async (req, res) => {
  const { body } = req;
  const enrollTransaction = await enrollTransactionService.createEnrollTransaction(body);
  return res.status(httpStatus.CREATED).json({ status: 'success', data: { enrollTransaction } });
});

const getEnrollTransactions = catchAsync(async (req, res) => {
  const enrollTransactions = await enrollTransactionService.getEnrollTransactionsPopulated();
  return res.status(httpStatus.OK).json({ status: 'success', data: { enrollTransactions } });
});

const getAllEnrollmentsOfUser = catchAsync(async (req, res) => {
  const { user } = req;
  const options = _.pick(req.query, ['page', 'limit', 'sort']);
  const enrollments = await enrollTransactionService.getEnrollTransactionsPopulated({ userId: user._id }, options);
  return res.status(httpStatus.OK).json({ status: 'success', data: { enrollments } });
});

const getEnrollmentTransactionByIdForUser = catchAsync(async (req, res) => {
  const { user } = req;
  const { enrollTransactionId } = req.params;
  const filters = {
    userId: user._id,
  };
  const enrollment = await enrollTransactionService.getEnrollTransactionByIdWithPopulate(enrollTransactionId, filters, user);
  const lectures = await Lecture.find({ courseId: enrollment.courseId, status: 'published' }).populate({
    path: 'isWatched',
    match: {
      userId: user._id,
    },
  });
  const totalLectures = lectures.length;
  let watchedLectureTotal = 0;
  lectures.forEach((lecture) => {
    if (lecture.isWatched) {
      watchedLectureTotal += 1;
    }
  });
  if (!enrollment) {
    throw new ApiError('no enrollment found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { enrollment, totalLectures, watchedLectureTotal } });
});

const getEnrollTransactionById = catchAsync(async (req, res) => {
  const { enrollTransactionId } = req.params;
  const enrollTransaction = await enrollTransactionService.getSingleEnrollTransaction({
    _id: enrollTransactionId,
    isDeleted: false,
  });
  if (!enrollTransaction) {
    throw new ApiError('no enrollTransaction found with this id', httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { enrollTransaction } });
});

const updateEnrollTransactionById = catchAsync(async (req, res) => {
  const { enrollTransactionId } = req.params;
  const { body } = req;
  const enrollTransaction = await enrollTransactionService.updateEnrollTransactionById(enrollTransactionId, body);
  return res.status(httpStatus.ok).json({ status: 'success', data: { enrollTransaction } });
});

const deleteEnrollTransactionById = catchAsync(async (req, res) => {
  const { enrollTransactionId } = req.params;
  await enrollTransactionService.deleteEnrollTransactionById(enrollTransactionId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {} });
});

const getEnrollmentTransactionsForAuthor = catchAsync(async (req, res) => {
  const { user } = req;
  const { courseId } = req.query;
  const filters = {
    primaryInstructor: user._id,
  };
  if (courseId) {
    filters._id = courseId;
  }
  let courses = await courseService.getCourses(filters);
  courses = courses.map((course) => course._id);
  const enrollments = await enrollTransactionService.getEnrollTransactionsPopulatedUser({ courseId: { $in: courses } });
  return res.status(httpStatus.OK).json({ status: 'success', data: { enrollments } });
});

const getEnrollmentTransactionsByIdForAuthor = catchAsync(async (req, res) => {
  const { enrollmentId } = req.params;
  const enrollment = await enrollTransactionService.getEnrollmentTransactionByFilter({ _id: enrollmentId });
  const user = await userService.getUserById(enrollment.userId);
  const lectures = await Lecture.find({ courseId: enrollment.courseId, status: 'published' }).populate({
    path: 'isWatched',
    match: {
      userId: user._id,
    },
  });
  const totalLectures = lectures.length;
  let watchedLectureTotal = 0;
  lectures.forEach((lecture) => {
    if (lecture.isWatched) {
      watchedLectureTotal += 1;
    }
  });
  const enrollments = await enrollTransactionService.getEnrollTransactionByIdWithPopulate(enrollmentId, {}, user);
  return res
    .status(httpStatus.OK)
    .json({ status: 'success', data: { enrollments, watchedLectureTotal, totalLectures, user } });
});

module.exports = {
  createEnrollTransaction,
  getEnrollTransactions,
  getEnrollTransactionById,
  deleteEnrollTransactionById,
  updateEnrollTransactionById,
  getAllEnrollmentsOfUser,
  getEnrollmentTransactionByIdForUser,
  getEnrollmentTransactionsForAuthor,
  getEnrollmentTransactionsByIdForAuthor,
};
