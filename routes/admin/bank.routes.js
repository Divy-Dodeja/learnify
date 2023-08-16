const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { BankMethodController } = require('../../controllers');
const router = express.Router();

router.route('/').get(auth, isAdmin, BankMethodController.getBankMethods);
router
  .route('/:methodId')
  .get(auth, isAdmin, BankMethodController.getBankMethodById)
  .put(auth, isAdmin, BankMethodController.updateBankMethodById)
  .delete(auth, isAdmin, BankMethodController.deleteBankMethodById);

module.exports = router;
