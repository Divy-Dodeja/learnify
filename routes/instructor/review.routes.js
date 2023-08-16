const express = require('express');
const auth = require('../../middlewares/auth');
const { ratingController } = require('../../controllers');
const { isAuthor } = require('../../middlewares/roles');

const router = express.Router();
router.get('/', auth, isAuthor, ratingController.getRatingsForAuthor);
router.put('/:ratingId', auth, isAuthor, ratingController.updateRatingById);

module.exports = router;
