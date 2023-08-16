const express = require('express');
const auth = require('../../middlewares/auth');
const { enrollTransactionController } = require('../../controllers');
const router = express.Router();

router.route('/').get(auth, enrollTransactionController.getEnrollmentTransactionsForAuthor);
router.route('/:enrollmentId').get(auth, enrollTransactionController.getEnrollmentTransactionsByIdForAuthor);

module.exports = router;
