const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');

const router = express.Router();

const { enrollTransactionController } = require('../../controllers');

router.route('/').get(auth, isAdmin, enrollTransactionController.getEnrollTransactions);

router
  .route('/:enrollTransactionId')
  .get(auth, isAdmin, enrollTransactionController.getEnrollTransactionById)
  .put(auth, isAdmin, enrollTransactionController.updateEnrollTransactionById)
  .delete(auth, isAdmin, enrollTransactionController.deleteEnrollTransactionById);

module.exports = router;
