const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const courseRoutes = require('./course.routes');
const instructorRoutes = require('./instructor');
const adminRoutes = require('./admin');
const lectureRoutes = require('./lecture.routes');
const enrollmentRoutes = require('./enrollment.routes');
const orderRoutes = require('./order.routes');
const ratingRoutes = require('./rating.routes');
const categoryRoutes = require('./category.routes');
const localizationRoutes = require('./localization.routes');
const testRoutes = require('./test.routes');
const uploadRoutes = require('./upload.routes');
const razorpayRoutes = require('./razorpay.routes');
const pages = require('./pages.route');

const router = express();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/lectures', lectureRoutes);
router.use('/instructors', instructorRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/admin', adminRoutes);
router.use('/orders', orderRoutes);
router.use('/ratings', ratingRoutes);
router.use('/categories', categoryRoutes);
router.use('/localizations', localizationRoutes);
router.use('/tests', testRoutes);
router.use('/uploads', uploadRoutes);
router.use('/razorpay', razorpayRoutes);
router.use('/pages', pages);

module.exports = router;
