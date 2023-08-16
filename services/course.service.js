const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Course, Notification, Rating } = require('../models');

/**
 * to Create the course
 * @param {Object} body body of the course
 * @returns {Promise<Course>}
 */
const createCourse = async (body) => {
  const course = new Course(body);
  await course.save();
  return course;
};

/**
 * to get the al courses
 * @param {Object} filters - add filters to filterout courses
 */
const getAllCourses = (filters = {}, options = {}) => {
  return Course.paginate({ ...filters }, { ...options });
};

const getCourses = (filters = {}) => {
  return Course.find(filters).sort('createdAt');
};

/**
 * to get the course by the id
 * @param {ObjectId} id ObjectId of the course
 * @param {Object} filters Object of the filters
 */
const getCourseById = (id, filters) => {
  return Course.findOne({ _id: id, ...filters });
};

const getCourseByIdWithPopulate = (id, filters) => {
  return Course.findOne({ _id: id, ...filters })
    .populate({
      path: 'sections',
      options: {
        sort: {
          order: 1,
        },
      },
      populate: [
        {
          path: 'lectures',
          options: {
            sort: {
              order: 1,
            },
          },
        },
      ],
    })
    .populate({ path: 'primaryInstructor' });
};

/**
 * to get the course by slug
 * @param {String} slug slug title of the course
 * @param {Object} filters Object of the filters
 */
const getCourseBySlug = (slug, filters) => {
  return Course.findOne({ slug, ...filters });
};

const getCourseBySlugWithPopulate = (slug, filters = {}) => {
  return Course.findOne({ slug, ...filters })
    .populate({
      path: 'sections',
      options: {
        sort: {
          order: 1,
        },
      },
      populate: [
        {
          path: 'lectures',
          options: {
            sort: {
              order: 1,
            },
          },
        },
      ],
    })
    .populate({ path: 'primaryInstructor', select: 'firstName lastName' })
    .populate({
      path: 'ratings',
      populate: [
        {
          path: 'user',
          select: 'firstName lastName image',
        },
      ],
      options: {
        limit: 10,
      },
    })
    .populate('enrollments');
};

/***
 * to get the home page data to display it to users.
 * @param categories {OBJECT}
 */
const getCoursesByCategoriesId = async (categories) => {
  let promiseObj = await Promise.all(
    categories.map(async (category) => {
      let course = await Course.find({ category: category._id, status: 'published' }).populate({
        path: 'ratings',
        populate: [
          {
            path: 'user',
            select: 'firstName lastName image',
          },
        ],
      });
      const coursesMap = await Promise.all(
        course.map(async (cr) => {
          const rating = await Rating.find({ course: cr._id });
          let avgRating = 0;
          rating.forEach((rt) => {
            avgRating += parseInt(rt.rating);
          });
          if (cr.ratings.length > 0) {
            avgRating = (parseInt(avgRating) / cr.ratings.length).toFixed(1);
          } else {
            avgRating = 1;
          }

          const crObj = {
            ...cr._doc,
            avgRating,
          };
          return crObj;
        })
      );
      return {
        ...category._doc,
        courses: coursesMap,
      };
    })
  );
  promiseObj = promiseObj.filter((promise) => promise.courses.length > 0);
  return promiseObj;
};

/**
 * Update course by its id
 * @param {id} User id
 * @param {Object} update body
 * @returns {Promise<User>>}
 */
const updateCourseById = async (id, body, filters = {}) => {
  const course = await getCourseById(id, filters);
  if (!course) {
    throw new ApiError('no course found with this id', httpStatus.BAD_REQUEST);
  }
  if (course.status === 'published' && body.status === 'draft') {
    throw new ApiError('you can not draft a course after published!', httpStatus.BAD_REQUEST);
  }
  if (body.status === 'in-review') {
    const userNotification = await Notification.create({
      title: 'course is successfully submitted for review',
      course: course._id,
      user: course.primaryInstructor,
    });
    const adminNotification = await Notification.create({
      title: 'course received for approve',
      isForAdmin: true,
      course: course._id,
    });
  }
  if (body.status === 'rejected') {
    const userNotification = await Notification.create({
      title: `course that you submitted for reveiw has been rejected for following reason: ${body.rejectReason}`,
      course: course._id,
      user: course.primaryInstructor,
    });
  }
  if (body.status === 'published') {
    const userNotification = await Notification.create({
      title: `course that you submitted for reveiw has been published!`,
      course: course._id,
      user: course.primaryInstructor,
    });
  }
  Object.assign(course, { ...body });
  const newCourse = await course.save();
  return newCourse;
};

const deleteCourseById = async (id, filters = {}) => {
  const course = await getCourseById(id, filters);
  if (!course) {
    throw new ApiError('no course found with this id', httpStatus.BAD_REQUEST);
  }
  await course.delete();
  return true;
};

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  createCourse,
  updateCourseById,
  deleteCourseById,
  getCourses,
  getCourseByIdWithPopulate,
  getCourseBySlugWithPopulate,
  getCoursesByCategoriesId,
};
