const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { sectionController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, sectionController.getSections);
router
  .route('/:sectionId')
  .get(auth, isAdmin, sectionController.getSectionById)
  .put(auth, isAdmin, sectionController.updateSectionById)
  .delete(auth, isAdmin, sectionController.deleteSectionById);

module.exports = router;
