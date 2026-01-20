const express = require('express');
const router = express.Router();
const { dashboardController } = require('../controllers');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get(
    '/stats',
    protect,
    authorize('Admin', 'Super Admin'),
    dashboardController.getStats
);

module.exports = router;
