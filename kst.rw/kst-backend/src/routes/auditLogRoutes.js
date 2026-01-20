const express = require('express');
const router = express.Router();
const { auditLogController } = require('../controllers');
const { protect, authorize } = require('../middleware/authMiddleware');

// All audit log routes are restricted to Admins
router.use(protect);
router.use(authorize('Admin', 'Super Admin'));

router.get('/', auditLogController.getLogs);

module.exports = router;
