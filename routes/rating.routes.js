const express = require('express');
const auth = require('../middlewares/auth');
const { isUser } = require('../middlewares/roles');
const { ratingController } = require('../controllers');
const router = express.Router();

router
  .route('/:courseId')
  .get(auth, isUser, ratingController.getRatingByCourseId)
  .post(auth, isUser, ratingController.createRatingForUser);
router.route('/:ratingId').put(auth, isUser, ratingController.updateRatingById);

module.exports = router;
