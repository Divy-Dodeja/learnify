const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { transactionController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, transactionController.getTransactions);
router
  .route('/:transactionId')
  .get(auth, isAdmin, transactionController.getTransactionById)
  .put(auth, isAdmin, transactionController.updateTransactionById)
  .delete(auth, isAdmin, transactionController.deleteTransactionById);

module.exports = router;
