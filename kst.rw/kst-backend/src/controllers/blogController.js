const { blogService, auditLogService } = require('../services'); // Added auditLogService
const { encodeUUID } = require('../utils/idUtils');

// Helper to sanitize and encode blog
const sanitizeBlog = (blog) => {
    if (!blog) return null;
    const plainBlog = blog.toJSON ? blog.toJSON() : blog;

    const sanitized = {
        ...plainBlog,
        id: encodeUUID(plainBlog.id),
        userId: plainBlog.userId ? encodeUUID(plainBlog.userId) : null
    };

    if (sanitized.author) {
        sanitized.author = {
            ...sanitized.author,
            id: sanitized.author.id ? encodeUUID(sanitized.author.id) : undefined
        };
    }

    return sanitized;
};

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               category:
 *                 type: string
 *               userId:
 *                 type: string
 *                 description: ID of the author (User)
 *     responses:
 *       201:
 *         description: Created successfully
 *       500:
 *         description: Server error
 */
const createBlog = async (req, res) => {
    try {
        const blogData = { ...req.body };

        // Ensure userId is set from the authenticated user
        if (req.user) {
            blogData.userId = req.user.id;
        }

        if (req.file) {
            blogData.image = req.file.path;
        }

        const blog = await blogService.createBlog(blogData);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'CREATE',
            entity: 'Blog',
            entityId: blog.id,
            details: { title: blog.title },
            req
        });

        res.status(201).json({ success: true, data: sanitizeBlog(blog) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of blogs
 *       500:
 *         description: Server error
 */
const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;

        const data = await blogService.getAllBlogs(page, limit, category);
        // Encode IDs in the blog list
        if (data.blogs) {
            data.blogs = data.blogs.map(b => sanitizeBlog(b));
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Blog details
 *       404:
 *         description: Not found
 */
const getBlogById = async (req, res) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
        res.status(200).json({ success: true, data: sanitizeBlog(blog) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update blog (Admin/Blogger)
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               category:
 *                 type: string
 *               published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Blog updated
 */
const updateBlog = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Sanitize updateData: remove read-only and primary key fields
        delete updateData.id;
        delete updateData.userId;
        delete updateData.created_at;
        delete updateData.updated_at;

        // Check for new image
        if (req.file) {
            updateData.image = req.file.path;
        }

        const blog = await blogService.updateBlog(req.params.id, updateData);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'UPDATE',
            entity: 'Blog',
            entityId: blog.id,
            details: { title: blog.title },
            req
        });

        res.status(200).json({ success: true, data: sanitizeBlog(blog) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Soft delete blog
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
const deleteBlog = async (req, res) => {
    try {
        const result = await blogService.deleteBlog(req.params.id);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'DELETE',
            entity: 'Blog',
            entityId: req.params.id,
            details: {},
            req
        });

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/blogs/{id}/restore:
 *   patch:
 *     summary: Restore soft-deleted blog
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Restored
 */
const restoreBlog = async (req, res) => {
    try {
        const result = await blogService.restoreBlog(req.params.id);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'RESTORE',
            entity: 'Blog',
            entityId: req.params.id,
            details: {},
            req
        });

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/blogs/{id}/force:
 *   delete:
 *     summary: Permanently delete blog
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Permanently deleted
 */
const forceDeleteBlog = async (req, res) => {
    try {
        const result = await blogService.forceDeleteBlog(req.params.id);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'FORCE_DELETE',
            entity: 'Blog',
            entityId: req.params.id,
            details: {},
            req
        });

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    restoreBlog,
    forceDeleteBlog,
};
