const express = require('express');
const auth = require('../../middlewares/auth');
const { isAuthor } = require('../../middlewares/roles');
const { lectureController } = require('../../controllers');
const { uploadService } = require('../../services');

const router = express.Router();

router
  .route('/:courseId/:sectionId')
  .post(
    auth,
    isAuthor,
    lectureController.createLecture
  )
  .get(auth, isAuthor, lectureController.getLecturesBySectionIdForAuthor);
router
  .route('/:lectureId')
  .get(auth, isAuthor, lectureController.getLectureByIdForAuthor)
  .put(auth, isAuthor, lectureController.updateLectureByIdForAuthor)
  .delete(auth, isAuthor, lectureController.deleteLectureByIdForAuthor);

module.exports = router;
