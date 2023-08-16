const httpStatus = require('http-status');
const _ = require('lodash');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sectionService, courseService } = require('../services');

const createSection = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { body, user } = req;
  const course = await courseService.getCourseById(courseId, {
    isDeleted: false,
    primaryInstructor: user._id,
  });
  if (!course) {
    throw new ApiError('no course found with this id!', httpStatus.BAD_REQUEST);
  }
  body.instructor = user;
  body.courseId = course._id;
  const section = await sectionService.createSection(body);
  return res.status(httpStatus.OK).send(section);
});

const getSectionByIdForAuthor = catchAsync(async (req, res) => {
  const { sectionId } = req.params;
  const { user } = req;
  const section = await sectionService.getSectionById(sectionId);
  if (!section) {
    throw new ApiError('no section found with this id!', httpStatus.BAD_REQUEST);
  }
  const course = await courseService.getCourseById(section.courseId, {
    user: user._id,
    $or: [{ primaryInstructor: user._id }, { instructors: { $in: [user._id] } }],
  });
  if (!course) {
    throw new ApiError('no section found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).send(section);
});

const updateSectionByIdForAuthor = catchAsync(async (req, res) => {
  const { sectionId } = req.params;
  const { body, user } = req;
  let section = await sectionService.getSectionById(sectionId, { isDeleted: false });
  if (!section) {
    throw new ApiError('no section found with this id!', httpStatus.BAD_REQUEST);
  }

  const course = await courseService.getCourseById(section.courseId, {
    $or: [{ primaryInstructor: user._id }, { instructors: { $in: [user._id] } }],
  });
  if (!course) {
    throw new ApiError('no section found with this id!', httpStatus.BAD_REQUEST);
  }
  section = await sectionService.updateSectionById(sectionId, body);
  return res.status(httpStatus.OK).send(section);
});

const deleteSectionByIdForAuthor = catchAsync(async (req, res) => {
  const { sectionId } = req.params;
  const { user } = req;
  const section = await sectionService.getSectionById(sectionId);
  if (!section) {
    throw new ApiError('no section found with this id!', httpStatus.BAD_REQUEST);
  }
  const course = await courseService.getCourseById(section.courseId, {
    $or: [{ primaryInstructor: user._id }, { instructors: { $in: [user._id] } }],
  });
  if (!course) {
    throw new ApiError('no section found with this id!', httpStatus.BAD_REQUEST);
  }
  await sectionService.deleteSectionById(sectionId, { isDeleted: false });
  return res.status(httpStatus.OK).send({ success: true });
});

const getSections = catchAsync(async (req, res) => {
  const filters = _.pick(req.query, ['courseId', 'instructor', 'status', 'isAvailble']);
  const sections = await sectionService.getSections(filters);
  return res.status(httpStatus.OK).json({ status: 'success', data: { sections } });
});

const getSectionById = catchAsync(async (req, res) => {
  const { sectionId } = req.params;
  const section = await sectionService.getSectionById(sectionId);
  return res.status(httpStatus.OK).json({ status: 'success', data: { section } });
});

const updateSectionById = catchAsync(async (req, res) => {
  const { sectionId } = req.params;
  const section = await sectionService.updateSectionById(sectionId, req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { section } });
});

const deleteSectionById = catchAsync(async (req, res) => {
  const { sectionId } = req.params;
  await sectionService.deleteSectionById(sectionId);
  return res.status(httpStatus.NO_CONTENT).json({ status: 'success', data: {}, message: 'section deleted!' });
});

const getSectionsForAuthorByCourseId = catchAsync(async (req, res) => {
  const { user } = req;
  const { courseId } = req.params;
  const sections = await sectionService.getSectionsWithOrderSort({
    courseId,
    instructor: user._id,
  });
  return res.status(httpStatus.OK).json({ status: 'success', data: { sections } });
});

module.exports = {
  createSection,
  updateSectionByIdForAuthor,
  getSectionByIdForAuthor,
  deleteSectionByIdForAuthor,
  getSections,
  getSectionById,
  updateSectionById,
  deleteSectionById,
  getSectionsForAuthorByCourseId,
};
