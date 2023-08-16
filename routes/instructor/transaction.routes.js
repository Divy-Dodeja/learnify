const express = require('express');
const auth = require('../../middlewares/auth');
const { isAuthor } = require('../../middlewares/roles');
const { transactionController } = require('../../controllers');
const router = express.Router();

router
  .route('/')
  .get(auth, isAuthor, transactionController.getTransactionsForInstructor)
  .post(auth, isAuthor, transactionController.createTransactionForInstructor);
router.route('/:transactionId').get(auth, isAuthor, transactionController.getTransactionByIdForInstructor);

module.exports = router;
