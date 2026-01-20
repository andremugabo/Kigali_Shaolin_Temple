const express = require('express');
const router = express.Router();
const { clubController } = require('../controllers'); // Fix import
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { decodeParam } = require('../middleware/idMiddleware');

// Protected (Create/Update)
router.post(
    '/',
    protect,
    authorize('Admin', 'Super Admin'),
    upload.single('image'),
    clubController.createClub
);

router.get('/', clubController.getAllClubs);
router.get('/:id', decodeParam('id'), clubController.getClubById);

router.put(
    '/:id',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Super Admin'),
    upload.single('image'), // Enable update with image
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
    upload.single('video'),
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
