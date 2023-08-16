const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { EnrollTransaction, Course, User, Lecture, Section, Rating, Comment, Order, SiteWallet } = require('../models');

const getAdminDashboardData = catchAsync(async (req, res) => {
  const enrollCount = await EnrollTransaction.count({});
  const courseCount = await Course.count({});
  const userCount = await User.count({});
  const instructorCount = await User.count({ isAuthor: true });
  const lectureCount = await Lecture.count({});
  const sectionCount = await Section.count({});
  const ratingCount = await Rating.count({});
  const commentCount = await Comment.count({});

  return res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      enrollments: enrollCount,
      courses: courseCount,
      users: userCount,
      instructors: instructorCount,
      lectures: lectureCount,
      sections: sectionCount,
      ratings: ratingCount,
      comments: commentCount,
    },
  });
});

const getAdminDashboardChartData = catchAsync(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $sort: { createdAt: 1 },
    },
    {
      $project: {
        timestamp: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      },
    },
    {
      $group: {
        _id: { timestamp: '$timestamp' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.timestamp': 1 },
    },

    {
      $limit: 10,
    },
  ]);

  const users = await User.aggregate([
    {
      $sort: { createdAt: 1 },
    },
    {
      $project: {
        timestamp: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      },
    },
    {
      $group: {
        _id: { timestamp: '$timestamp' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.timestamp': 1 },
    },
    {
      $limit: 10,
    },
  ]);
  const siteWallet = await SiteWallet.findOne({});
  return res.status(httpStatus.OK).json({ status: 'success', data: { orders, users, siteWallet } });
});

module.exports = {
  getAdminDashboardData,
  getAdminDashboardChartData,
};
