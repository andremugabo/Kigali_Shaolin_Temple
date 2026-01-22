const { aboutService, auditLogService } = require('../services'); // Added auditLogService
const { encodeUUID } = require('../utils/idUtils');

// Helper to sanitize and encode about
const sanitizeAbout = (about) => {
    if (!about) return null;
    const plainAbout = about.toJSON ? about.toJSON() : about;
    return {
        ...plainAbout,
        id: encodeUUID(plainAbout.id)
    };
};

/**
 * @swagger
 * tags:
 *   name: About
 *   description: About section management
 */

/**
 * @swagger
 * /api/about:
 *   post:
 *     summary: Create About section (Admin)
 *     tags: [About]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               founder_name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created successfully
 */
const createAbout = async (req, res) => {
    try {
        const aboutData = { ...req.body };
        if (req.file) {
            aboutData.image = req.file.path;
        }

        const about = await aboutService.createAbout(aboutData);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'CREATE',
            entity: 'About',
            entityId: about.id,
            details: { founder_name: about.founder_name },
            req
        });

        res.status(201).json({ success: true, data: sanitizeAbout(about) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: Get About section
 *     tags: [About]
 *     responses:
 *       200:
 *         description: About details
 */
const getAbout = async (req, res) => {
    try {
        const about = await aboutService.getAbout();
        res.status(200).json({ success: true, data: about ? [sanitizeAbout(about)] : [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/about/{id}:
 *   put:
 *     summary: Update About section (Admin)
 *     tags: [About]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               founder_name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated successfully
 */
const updateAbout = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        const about = await aboutService.updateAbout(req.params.id, updateData);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'UPDATE',
            entity: 'About',
            entityId: about.id,
            details: { founder_name: about.founder_name },
            req
        });

        res.status(200).json({ success: true, data: sanitizeAbout(about) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAbout,
    getAbout,
    updateAbout,
};
