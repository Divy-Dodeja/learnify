const httpStatus = require('http-status');
const _ = require('lodash');
const ApiError = require('../utils/ApiError');
const { lectureService, courseService, sectionService, enrollTransactionService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const s3Service = require('../services/s3.service');
const watchTransactionService = require('../services/watchTransaction.service');
const { getVideoDurationInSeconds } = require('get-video-duration');

const createLecture = catchAsync(async (req, res) => {
  const { body, user } = req;
  const { sectionId, courseId } = req.params;
  const course = await courseService.getCourseById(courseId, {
    $or: [{ primaryInstructor: user._id }, { instructors: { $in: [user._id] } }],
  });
  if (!course) {
    throw new ApiError('no course found with this id!', httpStatus.BAD_REQUEST);
  }
  const section = await sectionService.getSectionById(sectionId, {
    courseId: course._id,
  });
  if (!section) {
    throw new ApiError('no section found with this id!', httpStatus.BAD_REQUEST);
  }
  body.sectionId = sectionId;
  body.courseId = courseId;
  body.instructor = user._id;
  if (body.lecutreType === 'video') {
    const url = body.source[0].url;
    const duration = await getVideoDurationInSeconds(url);
    body.duration = duration;
    course.totalHours = course.totalHours + body.duration;
    await course.save();
  }
  const lecture = await lectureService.createLecture(body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { lecture } });
});

const getLectureByIdForAuthor = catchAsync(async (req, res) => {
  const { lectureId } = req.params;
  const { user } = req;
  const lecture = await lectureService.getLectureByFilter({ _id: lectureId, isDeleted: false });
  const course = await courseService.getCourseById(lecture.courseId, {
    $or: [{ primaryInstructor: user._id }, { instructors: { $in: [user._id] } }],
  });
  if (!course) {
    throw new ApiError('no lecture found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).send(lecture);
});

const updateLectureByIdForAuthor = catchAsync(async (req, res) => {
  const { lectureId } = req.params;
  const { user, body } = req;
  let lecture = await lectureService.getLectureByFilter({ _id: lectureId, isDeleted: false });
  const course = await courseService.getCourseById(lecture.courseId, {
    $or: [{ primaryInstructor: user._id }, { instructors: { $in: [user._id] } }],
  });
  if (!course) {
    throw new ApiError('no lecture found with this id!', httpStatus.BAD_REQUEST);
  }
  lecture = await lectureService.updateLectureByid(lectureId, body, { isDeleted: false });
  return res.status(httpStatus.OK).send(lecture);
});

const deleteLectureByIdForAuthor = catchAsync(async (req, res) => {
  const { lectureId } = req.params;
  const { user } = req;
  const lecture = await lectureService.getLectureByFilter({ _id: lectureId });
  if (!lecture) {
    throw new ApiError('no lecture found with this id!', httpStatus.BAD_REQUEST);
  }
  const course = await courseService.getCourseById(lecture.courseId, {
    $or: [{ primaryInstructor: user._id }, { instructors: { $in: [user._id] } }],
  });
  if (!course) {
    throw new ApiError('no lecture found with this id!', httpStatus.BAD_REQUEST);
  }
  await lectureService.deleteLectureById(lectureId);
  return res.status(httpStatus.OK).send({ success: true });
});

const getLectures = catchAsync(async (req, res) => {
  const filters = _.pick(req.query, ['courseId', 'lecutreType', 'status', 'sectionId']);
  const lectures = await lectureService.getLectures(filters);
  return res.status(httpStatus.OK).json({ status: 'success', data: { lectures } });
});

const getLectureById = catchAsync(async (req, res) => {
  const { lectureId } = req.params;
  const lecture = await lectureService.getLectureById(lectureId);

  return res.status(httpStatus.OK).json({ status: 'success', data: { lecture } });
});

const updateLectureById = catchAsync(async (req, res) => {
  const { lectureId } = req.params;
  const lecture = await lectureService.updateLectureByid(lectureId, req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { lecture } });
});

const deleteLectureById = catchAsync(async (req, res) => {
  const { lectureId } = req.params;
  await lectureService.deleteLectureById(lectureId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {}, message: 'deleted successfully' });
});

// for instructor

const getLecturesBySectionIdForAuthor = catchAsync(async (req, res) => {
  const { courseId, sectionId } = req.params;
  const { user } = req;
  const lectures = await lectureService.getLecturesByOrderSort({
    courseId,
    sectionId,
    instructor: user._id,
  });
  return res.status(httpStatus.OK).json({ status: 'success', data: { lectures } });
});

//  for the user

const getLectureByIdForUser = catchAsync(async (req, res) => {
  const { user } = req;
  const { lectureId } = req.params;
  const lecture = await lectureService.getLectureById(lectureId, {
    status: 'published',
  });
  if (!lecture) {
    throw new ApiError('no lecture found with this id! lecture', httpStatus.BAD_REQUEST);
  }
  const enrollment = await enrollTransactionService.getEnrollmentTransactionByFilter({
    courseId: lecture.courseId,
    userId: user._id,
  });
  if (!enrollment) {
    throw new ApiError('no lecture found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { lecture } });
});

const markLectureByIdForUserToComplete = catchAsync(async (req, res) => {
  const { user } = req;
  const { lectureId } = req.params;
  const lecture = await lectureService.getLectureById(lectureId, {
    status: 'published',
  });
  if (!lecture) {
    throw new ApiError('no lecture found with this id! lecture', httpStatus.BAD_REQUEST);
  }
  const enrollment = await enrollTransactionService.getEnrollmentTransactionByFilter({
    courseId: lecture.courseId,
    userId: user._id,
  });
  if (!enrollment) {
    throw new ApiError('no lecture found with this id!', httpStatus.BAD_REQUEST);
  }
  let watchTransaction = await watchTransactionService.getWatchTransaction({ lectureId: lecture._id, userId: user._id });
  if (watchTransaction) {
    watchTransaction.status = 1;
    await watchTransaction.save();
  } else {
    watchTransaction = await watchTransactionService.createWatchTransaction({
      lectureId: lecture._id,
      userId: user._id,
      status: 1,
    });
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { watchTransaction } });
});

module.exports = {
  createLecture,
  getLectureByIdForAuthor,
  updateLectureByIdForAuthor,
  deleteLectureByIdForAuthor,
  getLectures,
  updateLectureById,
  deleteLectureById,
  getLectureById,
  getLectureByIdForUser,
  getLecturesBySectionIdForAuthor,
  markLectureByIdForUserToComplete,
};
