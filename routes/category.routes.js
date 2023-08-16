const express = require('express');
const { categoryController } = require('../controllers');

const router = express.Router();

router.route('/').get(categoryController.getCategories);
router.route('/:categoryId').get(categoryController.getCategoryById);

module.exports = router;
