const express = require('express');
const auth = require('../../middlewares/auth');
const { isAuthor } = require('../../middlewares/roles');
const { BankMethodController } = require('../../controllers');
const router = express.Router();

router
  .route('/')
  .get(auth, isAuthor, BankMethodController.getBankMethodsForUser)
  .post(auth, isAuthor, BankMethodController.createBankMethod);

router.route('/default/:methodId').post(auth, isAuthor, BankMethodController.setCurrentBankAccountDefault);

router
  .route('/:methodId')
  .get(auth, isAuthor, BankMethodController.getBankMethodForUser)
  .put(auth, isAuthor, BankMethodController.updateBankMethodByIdForUser)
  .delete(auth, isAuthor, BankMethodController.deleteBankMethodByIdForUser);

module.exports = router;
