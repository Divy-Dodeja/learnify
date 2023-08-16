const express = require('express');
const auth = require('../../middlewares/auth');
const { isAuthor } = require('../../middlewares/roles');
const { sectionController } = require('../../controllers');

const router = express.Router();

router.route('/course/:courseId').get(auth, isAuthor, sectionController.getSectionsForAuthorByCourseId);
router.post('/:courseId', auth, isAuthor, sectionController.createSection);
router
  .route('/:sectionId')
  .get(auth, isAuthor, sectionController.getSectionByIdForAuthor)
  .put(auth, isAuthor, sectionController.updateSectionByIdForAuthor)
  .delete(auth, isAuthor, sectionController.deleteSectionByIdForAuthor);

module.exports = router;
