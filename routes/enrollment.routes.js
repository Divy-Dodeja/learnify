const express = require('express');
const auth = require('../middlewares/auth');
const { isUser } = require('../middlewares/roles');
const { enrollTransactionController } = require('../controllers');

const router = express.Router();

router.route('/').get(auth, isUser, enrollTransactionController.getAllEnrollmentsOfUser);
router.route('/:enrollTransactionId').get(auth, isUser, enrollTransactionController.getEnrollmentTransactionByIdForUser);

module.exports = router;
