const express = require('express');
const router = express.Router();
const { blogController } = require('../controllers');
const { logView } = require('../middleware/activityLogger');
const { protect, authorize, checkBlogOwnership } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware'); // Import upload
const { decodeParam } = require('../middleware/idMiddleware');

// Public
router.get('/', blogController.getAllBlogs);
router.get('/:id', decodeParam('id'), logView('Blog'), blogController.getBlogById);

// Protected
router.post(
    '/',
    protect,
    authorize('Admin', 'Content Manager', 'Blogger'),
    upload.single('image'), // Enable image upload
    blogController.createBlog
);

router.put(
    '/:id',
    decodeParam('id'),
    protect,
    checkBlogOwnership,
    upload.single('image'), // Enable image upload on update
    blogController.updateBlog
);

router.delete('/:id', decodeParam('id'), protect, checkBlogOwnership, blogController.deleteBlog);

// Restore a blog (Admin/Super Admin only)
router.patch('/:id/restore', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), blogController.restoreBlog);

// Force delete a blog (Admin/Super Admin only)
router.delete('/:id/force', decodeParam('id'), protect, authorize('Admin', 'Super Admin'), blogController.forceDeleteBlog);

module.exports = router;
