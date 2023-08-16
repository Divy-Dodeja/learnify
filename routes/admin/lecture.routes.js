const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { lectureController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, lectureController.getLectures);
router
  .route('/:lectureId')
  .get(auth, isAdmin, lectureController.getLectureById)
  .put(auth, isAdmin, lectureController.updateLectureById)
  .delete(auth, isAdmin, lectureController.deleteLectureById);

module.exports = router;
