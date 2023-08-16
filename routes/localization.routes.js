const express = require('express');
const { localizationController } = require('../controllers');

const router = express.Router();

router.route('/').get(localizationController.getLocalizations);
router.route('/:localizationId').get(localizationController.getLocalizationById);

module.exports = router;
