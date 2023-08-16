const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { categoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth, isAdmin, categoryController.getCategories)
  .post(auth, isAdmin, categoryController.createCategory);
router
  .route('/:id')
  .get(auth, isAdmin, categoryController.getCategoryById)
  .put(auth, isAdmin, categoryController.updateCategoryById)
  .delete(auth, isAdmin, categoryController.deleteCategoryById);

module.exports = router;
