const express = require('express');
const router = express.Router();
const { aboutController } = require('../controllers');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadImage, processAboutImage } = require('../middleware/uploadMiddleware');
const { decodeParam } = require('../middleware/idMiddleware');

router.get('/', aboutController.getAbout);

// Protected
router.post(
    '/',
    protect,
    authorize('Admin', 'Super Admin'),
    uploadImage.single('image'),
    processAboutImage,
    aboutController.createAbout
);

router.put(
    '/:id',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Super Admin'),
    uploadImage.single('image'),
    processAboutImage,
    aboutController.updateAbout
);

module.exports = router;
