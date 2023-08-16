const express = require('express');
const { commentController } = require('../controllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/:courseId/:lectureId').post(auth, commentController.createComment);

router.route('/:courseId').get(auth, commentController.getCommentsByCourseId);

module.exports = router;
