const express = require('express');
const auth = require('../middlewares/auth');
const { isUser } = require('../middlewares/roles');
const { lectureController } = require('../controllers');

const router = express.Router();
router.route('/:lectureId/complete').post(auth, isUser, lectureController.markLectureByIdForUserToComplete);
router.route('/:lectureId').get(auth, isUser, lectureController.getLectureByIdForUser);

module.exports = router;
