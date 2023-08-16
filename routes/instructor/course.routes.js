const express = require('express');
const { courseController } = require('../../controllers');
const { isAuthor } = require('../../middlewares/roles');
const auth = require('../../middlewares/auth');
// const { uploadService } = require('../../services');

const router = express.Router();

router
  .route('/')
  .get(auth, isAuthor, courseController.getAllCoursesOfInstructor)
  .post(auth, isAuthor, courseController.createCourse);
router
  .route('/:courseId')
  .get(auth, isAuthor, courseController.getCourseByIdForInstructor)
  .put(auth, isAuthor, courseController.updateCourseByIdForInstructor)
  .delete(auth, isAuthor, courseController.deleteCourseByIdForInstructor);

module.exports = router;
