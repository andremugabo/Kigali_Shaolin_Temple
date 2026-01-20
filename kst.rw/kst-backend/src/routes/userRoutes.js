const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');

const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware'); // Import upload middleware

// Public Routes
router.post('/login', userController.login);
router.post('/reset-password/:token', userController.resetPassword);

// Protected Routes
router.use(protect);

// Profile Routes (Authenticated Users)
router.get('/profile', userController.getProfile);
router.patch('/profile', upload.single('image'), userController.updateProfile);

// Admin / Super Admin Routes
router.post('/', authorize('Admin', 'Super Admin'), upload.single('image'), userController.createUser);
router.get('/', authorize('Admin', 'Super Admin'), userController.getAllUsers);
router.get('/:id', authorize('Admin', 'Super Admin'), userController.getUserById);
router.put('/:id', authorize('Admin', 'Super Admin'), upload.single('image'), userController.updateUser);
router.delete('/:id', authorize('Admin', 'Super Admin'), userController.deleteUser);
router.patch('/:id/restore', authorize('Admin', 'Super Admin'), userController.restoreUser);
router.delete('/:id/force', authorize('Admin', 'Super Admin'), userController.forceDeleteUser);

module.exports = router;
