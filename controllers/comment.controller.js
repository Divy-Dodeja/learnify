const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commentService, courseService, lectureService, enrollTransactionService } = require('../services');

const getCommentById = catchAsync(async (req, res) => {
  const { courseId, lectureId, commentId } = req.params;
  const comment = await commentService.getCommentByFilter({ _id: commentId, courseId, lectureId, isDeleted: false });
  return res.status(httpStatus.OK).json({ status: 'success', data: { comment } });
});
const getCommentsByLectureId = catchAsync(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const comments = await commentService.getComments({ courseId, lectureId, isDeleted: false });
  return res.status(httpStatus.OK).json({ status: 'success', data: { comments } });
});

const createComment = catchAsync(async (req, res) => {
  const { user, body } = req;
  const { courseId, lectureId } = req.params;
  const course = await courseService.getCourseById(courseId);
  if (!course) {
    throw new ApiError('no course found with this id!', httpStatus.BAD_REQUEST);
  }

  const lecture = await lectureService.getLectureById(lectureId, { courseId });
  if (!lecture) {
    throw new ApiError('no lecture found with this course id!', httpStatus.BAD_REQUEST);
  }

  const enrollmentTransaction = await enrollTransactionService.getEnrollmentTransactionByFilter({ user: user._id });
  if (!enrollmentTransaction && course.primaryInstructor.toString() !== user._id.toString()) {
    throw new ApiError(
      'you can not comment on this course because you are not enrolled in this course!',
      httpStatus.BAD_REQUEST
    );
  }

  const commentBody = {
    courseId,
    lectureId,
    userId: user._id,
    ...body,
  };
  const comment = await commentService.createComment(commentBody);
  return res.status(httpStatus.CREATED).json({ status: 'success', data: { comment } });
});

const getCommentsByCourseId = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const comments = await commentService.getComments({ courseId, isDeleted: false });
  return res.status(httpStatus.OK).json({ status: 'success', data: { comments } });
});

const getComments = catchAsync(async (req, res) => {
  const comments = await commentService.getComments();
  return res.status(httpStatus.OK).json({ status: 'success', data: { comments } });
});

const getCommentByIdForAdmin = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await commentService.getCommentsById(commentId);
  if (!comment) {
    throw new ApiError('no comment found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { comment } });
});

const updateCommentById = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await commentService.updateCommentById(commentId, req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { comment } });
});

const deleteCommentById = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  await commentService.deleteCommentById(commentId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {}, message: 'comment deleted Successfully!' });
});

module.exports = {
  getCommentById,
  getCommentsByLectureId,
  createComment,
  getCommentsByCourseId,
  getComments,
  getCommentByIdForAdmin,
  updateCommentById,
  deleteCommentById,
};
