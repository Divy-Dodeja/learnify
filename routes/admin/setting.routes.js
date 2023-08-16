const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const settingController = require('../../controllers/settingController');

const router = express.Router();

router
  .route('/')
  .get(auth, isAdmin, settingController.getSiteSetting)
  .put(auth, isAdmin, settingController.updateSiteSetting);

module.exports = router;
