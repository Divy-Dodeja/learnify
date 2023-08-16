const express = require('express');
const TempAuth = require('../middlewares/tempAuth');
const { courseController } = require('../controllers');

const router = express.Router();

router.route('/').get(courseController.getAllCourse);
router.route('/home').get(courseController.getHomePageData);
router.route('/category/:categoryId').get(courseController.getCoursesByCategoryId);
router.route('/course/:slug').get(TempAuth, courseController.getCourseBySlug);
router.route('/:courseId').get(courseController.getCourseByIdForUser);

module.exports = router;
