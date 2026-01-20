const express = require('express');
const router = express.Router();
const { contactMessageController } = require('../controllers');
const { protect, authorize } = require('../middleware/authMiddleware');
const { decodeParam } = require('../middleware/idMiddleware');

// Public
router.post('/', contactMessageController.createMessage);

// Admin Only
router.get('/', protect, authorize('Admin', 'Super Admin'), contactMessageController.getAllMessages);
router.get('/:id', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), contactMessageController.getMessageById);
router.patch('/:id/read', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), contactMessageController.markAsRead);
router.delete('/:id', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), contactMessageController.deleteMessage);

// Restore & Force Delete (Admin Only)
router.patch('/:id/restore', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), contactMessageController.restoreMessage);
router.delete('/:id/force', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), contactMessageController.forceDeleteMessage);

module.exports = router;
