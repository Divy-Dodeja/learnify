const express = require('express');
const { notificationController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.route('/').get(auth, notificationController.getNotificationsForInstructor);
router
  .route('/:notificationId')
  .put(auth, notificationController.updateNotificationById)
  .get(auth, notificationController.getNotificationById);

module.exports = router;
