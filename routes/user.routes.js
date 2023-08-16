const express = require('express');
const auth = require('../middlewares/auth');
const { userController } = require('../controllers');
const validate = require('../middlewares/validate');
const { userValidation } = require('../validations');

const router = express.Router();

router.route('/me/upgrade-to-instructor').post(auth, userController.upgradeToInstructor);

router
  .route('/me')
  .get(auth, userController.getCurrentUserProfile)
  .put(auth, validate(userValidation.updateUserBody), userController.updateCurrentUserProfile);
router.patch('/me/change-password', auth, validate(userValidation.changePassword), userController.changeCurrentUserPassword);
module.exports = router;
