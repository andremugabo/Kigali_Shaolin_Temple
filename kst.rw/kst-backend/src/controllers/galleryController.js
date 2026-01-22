const { galleryService } = require('../services');
const { logAction } = require('../services/auditLogService');
const { encodeUUID } = require('../utils/idUtils');

// Helper to sanitize and encode gallery item
const sanitizeGallery = (item) => {
    if (!item) return null;
    const plainItem = item.toJSON ? item.toJSON() : item;
    return {
        ...plainItem,
        id: encodeUUID(plainItem.id)
    };
};

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: Gallery management
 */

/**
 * @swagger
 * /api/gallery:
 *   post:
 *     summary: Upload a new media item (Admin)
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *               mediaType:
 *                 type: string
 *                 enum: [IMAGE, VIDEO]
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 */
const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { title, description, eventDate, category, mediaType } = req.body;

        // Normalize mediaType to uppercase for enum compatibility (IMAGE/VIDEO)
        const normalizedMediaType = mediaType ? mediaType.toUpperCase() : 'IMAGE';

        const galleryItem = await galleryService.createGalleryItem({
            title,
            description,
            eventDate,
            category,
            mediaType: normalizedMediaType,
            mediaUrl: req.file.path, // Full path with absolute URL
            publicId: req.file.filename,
        });

        // Log Action
        await logAction({
            userId: req.user.id,
            action: 'CREATE',
            entity: 'Gallery',
            entityId: galleryItem.id,
            details: { title, publicId: req.file.filename },
            req
        });

        res.status(201).json({ success: true, data: sanitizeGallery(galleryItem) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Get all gallery items
 *     tags: [Gallery]
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
 *       - in: query
 *         name: mediaType
 *         schema:
 *           type: string
 *           enum: [IMAGE, VIDEO]
 *       - in: query
 *         name: eventDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of gallery items
 */
const getAllMedia = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filters = {
            category: req.query.category,
            eventDate: req.query.eventDate,
            mediaType: req.query.mediaType,
        };
        const data = await galleryService.getAllGalleryItems(filters, page, limit);
        // Encode IDs in the gallery list
        if (data.items) {
            data.items = data.items.map(i => sanitizeGallery(i));
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/gallery/{id}:
 *   put:
 *     summary: Update gallery metadata (Admin)
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated successfully
 */
const updateMedia = async (req, res) => {
    try {
        const { title, description, eventDate, category } = req.body;
        const galleryItem = await galleryService.updateGalleryItem(req.params.id, {
            title,
            description,
            eventDate,
            category
        });

        // Log Action
        await logAction({
            userId: req.user.id,
            action: 'UPDATE',
            entity: 'Gallery',
            entityId: galleryItem.id,
            details: { title, category },
            req
        });

        res.status(200).json({ success: true, data: sanitizeGallery(galleryItem) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/gallery/{id}:
 *   delete:
 *     summary: Soft delete gallery item (Admin)
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
const deleteMedia = async (req, res) => {
    try {
        const result = await galleryService.deleteGalleryItem(req.params.id);

        // Log Action
        await logAction({
            userId: req.user.id,
            action: 'DELETE',
            entity: 'Gallery',
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
 * /api/gallery/{id}/restore:
 *   patch:
 *     summary: Restore soft-deleted item (Admin)
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Restored
 */
const restoreMedia = async (req, res) => {
    try {
        const result = await galleryService.restoreGalleryItem(req.params.id);

        // Log Action
        await logAction({
            userId: req.user.id,
            action: 'RESTORE',
            entity: 'Gallery',
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
 * /api/gallery/{id}/force:
 *   delete:
 *     summary: Permanently delete gallery item (Admin)
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Permanently deleted
 */
const forceDeleteMedia = async (req, res) => {
    try {
        const result = await galleryService.forceDeleteGalleryItem(req.params.id);

        // Log Action
        await logAction({
            userId: req.user.id,
            action: 'FORCE_DELETE',
            entity: 'Gallery',
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
    uploadMedia,
    getAllMedia,
    updateMedia,
    deleteMedia,
    restoreMedia,
    forceDeleteMedia
};
