const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { courseController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, courseController.getAllCoursesForAdmin);
router
  .route('/:courseId')
  .get(auth, isAdmin, courseController.getCourseById)
  .put(auth, isAdmin, courseController.updateCourseById)
  .delete(auth, isAdmin, courseController.deleteCourseById);

module.exports = router;
