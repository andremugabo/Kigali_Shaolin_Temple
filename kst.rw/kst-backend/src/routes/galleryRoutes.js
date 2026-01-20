const express = require('express');
const router = express.Router();
const { galleryController } = require('../controllers');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { decodeParam } = require('../middleware/idMiddleware');

// Public Routes
router.get('/', galleryController.getAllMedia);

// Protected Routes
router.post(
    '/',
    protect,
    authorize('Admin', 'Content Manager', 'Super Admin'),
    upload.single('file'),
    galleryController.uploadMedia
);

router.put(
    '/:id',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Content Manager', 'Super Admin'),
    galleryController.updateMedia
);

router.delete(
    '/:id',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Content Manager', 'Super Admin'),
    galleryController.deleteMedia
);

// Restore & Force Delete (Admin Only)
router.patch(
    '/:id/restore',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Super Admin'),
    galleryController.restoreMedia
);

router.delete(
    '/:id/force',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Super Admin'),
    galleryController.forceDeleteMedia
);

module.exports = router;
