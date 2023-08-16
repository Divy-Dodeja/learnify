const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { courseService, categoryService, enrollTransactionService } = require('../services');
const pick = require('../utils/pick');

/* eslint-disable */
const getAllCourse = catchAsync(async (req, res) => {
  const { search, category } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = [{ path: 'primaryInstructor', select: 'firstName lastName' }];
  const filters = {
    status: 'published',
  };
  if (category) {
    filters.category = category;
  }
  let courses;
  if (search) {
    courses = await courseService.getAllCourses(
      {
        ...filters,
        $or: [{ title: new RegExp(search, 'i') }, { keywords: new RegExp(search, 'i') }],
      },
      options
    );
  } else {
    courses = await courseService.getAllCourses(filters, options);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { courses } });
});
/* eslint-enable */

const getHomePageData = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  const categoryObject = categories.map((cat) => cat._id);
  const courses = await courseService.getCoursesByCategoriesId(categories);
  return res.status(httpStatus.OK).json({ status: 'success', data: { courses } });
});

const getCoursesByCategoryId = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filters = {
    category: categoryId,
    status: 'published',
  };

  const courses = await courseService.getAllCourses(filters, options);
  return res.status(httpStatus.OK).json({ status: 'success', data: { courses } });
});

const getCourseBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const course = await courseService.getCourseBySlugWithPopulate(slug, {
    status: 'published',
  });
  let avgRating = 0;
  course.ratings.forEach((rating) => {
    avgRating += rating.rating;
  });
  avgRating = (avgRating / course.ratings.length).toFixed(1);
  let enrollment = {};
  if (req.user) {
    enrollment = await enrollTransactionService.getEnrollmentTransactionByFilter({
      userId: req.user._id,
      courseId: course._id,
    });
  }
  return res.status(httpStatus.OK).send({ status: 'success', data: { course, avgRating, enrollment } });
});

const getAllCoursesForAdmin = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['status', 'primaryInstructor', 'isFree']);
  const courses = await courseService.getCourses(filters);
  return res.status(httpStatus.OK).json({ status: 'success', data: { courses } });
});

const getAllCoursesOfInstructor = catchAsync(async (req, res) => {
  const { user } = req;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filters = {
    $or: [{ primaryInstructor: user._id }, { instructors: { $in: [user._id] } }],
  };
  options.limit = 1000;
  const courses = await courseService.getAllCourses(filters, options);
  return res.status(httpStatus.OK).json({ status: 'success', data: { courses } });
});

const getCourseById = catchAsync(async (req, res) => {
  const course = await courseService.getCourseByIdWithPopulate(req.params.courseId);
  if (!course) {
    throw new ApiError('No Course found with this id', httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { course } });
});

const getCourseByIdForInstructor = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { user } = req;
  const filters = {
    primaryInstructor: user._id,
  };
  const course = await courseService.getCourseById(courseId, filters);

  if (!course) {
    throw new ApiError('no course found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { course } });
});

const createCourse = catchAsync(async (req, res) => {
  const { body, user } = req;
  if (!(user.isAuthor || user.isAdmin)) {
    throw new ApiError('Only instructor can create new Course', httpStatus.BAD_REQUEST);
  }
  body.primaryInstructor = user._id;

  const course = await courseService.createCourse(body);
  return res.status(httpStatus.CREATED).json({ status: 'success', data: { course } });
});

const updateCourseById = catchAsync(async (req, res) => {
  const course = await courseService.updateCourseById(req.params.courseId, req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { course } });
});

const updateCourseByIdForInstructor = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { user, body } = req;
  const filters = {
    isDeleted: false,
    $or: [{ primaryInstructor: user._id }, { instructors: { $in: [user._id] } }],
  };
  const course = await courseService.updateCourseById(courseId, body, filters);
  return res.status(httpStatus.OK).json({ status: 'success', data: { course } });
});

const deleteCourseByIdForInstructor = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { user } = req;
  const filters = {
    isDeleted: false,
    $or: [{ primaryInstructor: user._id }, { instructors: { $in: [user._id] } }],
  };
  await courseService.deleteCourseById(courseId, filters);
  return res.status(httpStatus.OK).json({ status: true, message: 'course deleted successfully' });
});

const deleteCourseById = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const filters = {
    isDeleted: false,
  };
  await courseService.deleteCourseById(courseId, filters);
  return res.status(httpStatus.OK).json({ status: true, message: 'course deleted successfully' });
});

const getCourseByIdForUser = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const filters = {
    isDeleted: false,
    status: 'published',
  };
  const course = await courseService.getCourseById(courseId, filters);
  if (!course) {
    throw new ApiError('no course found with this id!', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).send({ status: 'success', data: { course } });
});

module.exports = {
  getAllCourse,
  getCourseById,
  createCourse,
  updateCourseById,
  getAllCoursesOfInstructor,
  getCourseByIdForInstructor,
  deleteCourseById,
  deleteCourseByIdForInstructor,
  updateCourseByIdForInstructor,
  getAllCoursesForAdmin,
  getCoursesByCategoryId,
  getCourseByIdForUser,
  getCourseBySlug,
  getHomePageData,
};
