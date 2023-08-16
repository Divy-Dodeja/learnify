const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');

const dashboardController = require('../../controllers/dashboard.controller');
const router = express.Router();

router.get('/', auth, isAdmin, dashboardController.getAdminDashboardData);
router.get('/chart', auth, isAdmin, dashboardController.getAdminDashboardChartData);

module.exports = router;
