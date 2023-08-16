const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { walletController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, walletController.getWallets);
router
  .route('/:walletId')
  .get(auth, isAdmin, walletController.getWalletById)
  .put(auth, isAdmin, walletController.updateWalletById);

module.exports = router;
