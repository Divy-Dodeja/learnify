const express = require('express');
const { uploadController } = require('../controllers');
const auth = require('../middlewares/auth');
const router = express.Router();

router.route('/image').post(auth, uploadController.createImageS3Link);
router.route('/other').post(auth, uploadController.createAnyS3Link);
router.route('/video').post(auth, uploadController.createVideoS3Link);

module.exports = router;
