const express = require('express');
const router = express.Router();
const { programController } = require('../controllers');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { decodeParam } = require('../middleware/idMiddleware');

router.post(
    '/',
    protect,
    authorize('Admin', 'Content Manager', 'Super Admin'),
    upload.single('image'),
    programController.createProgram
);

router.get('/', programController.getAllPrograms);
router.get('/:id', decodeParam('id'), programController.getProgramById);

router.put(
    '/:id',
    decodeParam('id'),
    protect,
    authorize('Admin', 'Content Manager', 'Super Admin'),
    upload.single('image'),
    programController.updateProgram
);

router.delete('/:id', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), programController.deleteProgram);

router.patch('/:id/restore', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), programController.restoreProgram);
router.delete('/:id/force', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), programController.forceDeleteProgram);

module.exports = router;
