const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { ratingController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, ratingController.getRatings);
router
  .route('/:ratingId')
  .get(auth, isAdmin, ratingController.getRatingById)
  .put(auth, isAdmin, ratingController.updateRatingById)
  .delete(auth, isAdmin, ratingController.deleteRatingById);

module.exports = router;
