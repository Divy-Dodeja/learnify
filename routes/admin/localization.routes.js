const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { localizationController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth, isAdmin, localizationController.getLocalizations)
  .post(auth, isAdmin, localizationController.createLocalization);
router
  .route('/:localizationId')
  .get(auth, isAdmin, localizationController.getLocalizationById)
  .put(auth, isAdmin, localizationController.updateLocalizationById)
  .delete(auth, isAdmin, localizationController.deleteLocalizationById);

module.exports = router;
