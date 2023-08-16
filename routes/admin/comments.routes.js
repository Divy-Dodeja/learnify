const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { commentController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, commentController.getComments);
router
  .route('/:commentId')
  .get(auth, isAdmin, commentController.getCommentById)
  .put(auth, isAdmin, commentController.updateCommentById)
  .delete(auth, isAdmin, commentController.deleteCommentById);

module.exports = router;
