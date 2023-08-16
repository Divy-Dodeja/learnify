const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { pageController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, pageController.getPages).post(auth, isAdmin, pageController.createPage);
router
  .route('/:pageId')
  .get(auth, isAdmin, pageController.getPageById)
  .put(auth, isAdmin, pageController.updatePageById)
  .delete(auth, isAdmin, pageController.deletePageById);

module.exports = router;
