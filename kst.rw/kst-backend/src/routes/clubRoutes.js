const express = require('express');
const router = express.Router();
const { clubController } = require('../controllers');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadImage, uploadVideo, processClubImage, processVideo } = require('../middleware/uploadMiddleware');
const { decodeParam } = require('../middleware/idMiddleware');

// Protected (Create/Update)
router.post(
    '/',
    protect,
    authorize('Admin', 'Super Admin'),
    uploadImage.single('image'),
    processClubImage,
    clubController.createClub
);

router.get('/', clubController.getAllClubs);
router.get('/:id', decodeParam('id'), clubController.getClubById);

router.put(
    '/:id',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Super Admin'),
    uploadImage.single('image'), // Enable update with image
    processClubImage,
    clubController.updateClub
);

router.delete('/:id', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), clubController.deleteClub);

router.patch('/:id/restore', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), clubController.restoreClub);
router.delete('/:id/force', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), clubController.forceDeleteClub);

// Tutorial Routes
router.post(
    '/:id/tutorials',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Content Manager', 'Super Admin'),
    uploadVideo.single('video'),
    processVideo,
    clubController.addTutorial
);

router.get('/:id/tutorials', decodeParam('id'), clubController.getTutorials);

router.delete(
    '/tutorials/:tutorialId',
    decodeParam('tutorialId'),
    protect,
    authorize('Admin', 'Content Manager', 'Super Admin'),
    clubController.removeTutorial
);

module.exports = router;
