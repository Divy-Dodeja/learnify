const express = require('express');
const { commentController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const { isAuthor } = require('../../middlewares/roles');

const router = express.Router();

router.route('/course/:courseId').get(auth, isAuthor, commentController.getCommentsByCourseId);
router.route('/:courseId/:lectureId').post(auth, isAuthor, commentController.createComment);
router.route('/:commentId').get(auth, isAuthor, commentController.getCommentById);

module.exports = router;
