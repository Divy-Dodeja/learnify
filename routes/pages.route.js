const express = require('express');

const { pageController } = require('../controllers');

const router = express.Router();

router.route('/').get(pageController.getPages);
router.route('/slug/:slug').get(pageController.getPageBySlug);
router.route('/:pageId').get(pageController.getPageById);

module.exports = router;
