const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { notificationController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, notificationController.getNotificationsForAdmin);
router.route('/:notificationId').get(auth, isAdmin, notificationController.getNotificationById);

module.exports = router;
