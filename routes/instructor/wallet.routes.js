const express = require('express');
const { walletController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const { isAuthor } = require('../../middlewares/roles');

const router = express.Router();

router.route('/').get(auth, isAuthor, walletController.getWallet);

module.exports = router;
