const express = require('express');
const coursesRoutes = require('./course.routes');
const lectureRoutes = require('./lecture.routes');
const sectionRoutes = require('./section.routes');
const notificationRoutes = require('./notification.routes');
const enrollments = require('./enrollment.routes');
const walletRoutes = require('./wallet.routes');
const transactionRoutes = require('./transaction.routes');
const couponRoutes = require('./coupon.routes');
const ratingRoutes = require('./review.routes');
const bankRoutes = require('./bankMethods.routes');

const router = express.Router();

router.use('/courses', coursesRoutes);
router.use('/sections', sectionRoutes);
router.use('/lectures', lectureRoutes);
router.use('/notifications', notificationRoutes);
router.use('/enrollments', enrollments);
router.use('/wallet', walletRoutes);
router.use('/bank', bankRoutes);
router.use('/transactions', transactionRoutes);
router.use('/coupons', couponRoutes);
router.use('/ratings', ratingRoutes);

module.exports = router;
