const express = require('express');
const router = express.Router();
const { aboutController } = require('../controllers');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { decodeParam } = require('../middleware/idMiddleware');

router.get('/', aboutController.getAbout);

// Protected
router.post(
    '/',
    protect,
    authorize('Admin', 'Super Admin'),
    upload.single('image'),
    aboutController.createAbout
);

router.put(
    '/:id',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Super Admin'),
    upload.single('image'),
    aboutController.updateAbout
);

module.exports = router;
