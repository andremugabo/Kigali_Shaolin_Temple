const express = require('express');
const router = express.Router();
const { heroSlideController } = require('../controllers');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadImage, processHeroSlide } = require('../middleware/uploadMiddleware');
const { decodeParam } = require('../middleware/idMiddleware');

router.get('/', heroSlideController.getAllSlides);
router.get('/:id', decodeParam('id'), heroSlideController.getSlideById);

// Protected Routes
router.post(
    '/',
    protect,
    authorize('Admin', 'Content Manager', 'Super Admin'),
    uploadImage.single('image'),
    processHeroSlide,
    heroSlideController.createSlide
);

router.put(
    '/:id',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Content Manager', 'Super Admin'),
    uploadImage.single('image'),
    processHeroSlide,
    heroSlideController.updateSlide
);

router.delete(
    '/:id',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Super Admin'),
    heroSlideController.deleteSlide
);

module.exports = router;
