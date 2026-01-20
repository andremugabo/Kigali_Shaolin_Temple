const { clubService, auditLogService } = require('../services'); // Added auditLogService
const { encodeUUID } = require('../utils/idUtils');

// Helper to sanitize and encode club
const sanitizeClub = (club) => {
    if (!club) return null;
    const plainClub = club.toJSON ? club.toJSON() : club;
    const sanitized = {
        ...plainClub,
        id: encodeUUID(plainClub.id)
    };
    if (sanitized.tutorials) {
        sanitized.tutorials = sanitized.tutorials.map(t => ({
            ...t,
            id: encodeUUID(t.id),
            clubId: encodeUUID(t.clubId)
        }));
    }
    return sanitized;
};

// Helper to sanitize tutorial
const sanitizeTutorial = (tutorial) => {
    if (!tutorial) return null;
    const plainTutorial = tutorial.toJSON ? tutorial.toJSON() : tutorial;
    return {
        ...plainTutorial,
        id: encodeUUID(plainTutorial.id),
        clubId: encodeUUID(plainTutorial.clubId)
    };
};

/**
 * @swagger
 * tags:
 *   name: Clubs
 *   description: Club/Branch management
 */

/**
 * @swagger
 * /api/clubs:
 *   post:
 *     summary: Create a new club (Admin)
 *     tags: [Clubs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Club created
 */
const createClub = async (req, res) => {
    try {
        const clubData = { ...req.body };
        if (req.file) {
            clubData.image = req.file.path;
        }

        const club = await clubService.createClub(clubData);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'CREATE',
            entity: 'Club',
            entityId: club.id,
            details: { name: club.name },
            req
        });

        res.status(201).json({ success: true, data: sanitizeClub(club) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/clubs:
 *   get:
 *     summary: Get all clubs
 *     tags: [Clubs]
 *     responses:
 *       200:
 *         description: List of clubs
 */
const getAllClubs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const data = await clubService.getAllClubs(page, limit);
        // Encode IDs in the club list
        if (data.clubs) {
            data.clubs = data.clubs.map(c => sanitizeClub(c));
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/clubs/{id}:
 *   get:
 *     summary: Get club by ID
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Club details
 */
const getClubById = async (req, res) => {
    try {
        const club = await clubService.getClubById(req.params.id);
        if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
        res.status(200).json({ success: true, data: sanitizeClub(club) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/clubs/{id}:
 *   put:
 *     summary: Update club (Admin)
 *     tags: [Clubs]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Club updated
 */
const updateClub = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        const club = await clubService.updateClub(req.params.id, updateData);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'UPDATE',
            entity: 'Club',
            entityId: club.id,
            details: { name: club.name },
            req
        });

        res.status(200).json({ success: true, data: sanitizeClub(club) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/clubs/{id}:
 *   delete:
 *     summary: Soft delete club (Admin)
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
const deleteClub = async (req, res) => {
    try {
        const result = await clubService.deleteClub(req.params.id);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'DELETE',
            entity: 'Club',
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
 * /api/clubs/{id}/restore:
 *   patch:
 *     summary: Restore soft-deleted club (Admin)
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Restored
 */
const restoreClub = async (req, res) => {
    try {
        const result = await clubService.restoreClub(req.params.id);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'RESTORE',
            entity: 'Club',
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
 * /api/clubs/{id}/force:
 *   delete:
 *     summary: Permanently delete club (Admin)
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Permanently deleted
 */
const forceDeleteClub = async (req, res) => {
    try {
        const result = await clubService.forceDeleteClub(req.params.id);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'FORCE_DELETE',
            entity: 'Club',
            entityId: req.params.id,
            details: {},
            req
        });

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Tutorial Controllers ---

/**
 * @swagger
 * /api/clubs/{id}/tutorials:
 *   post:
 *     summary: Add video tutorial to club (Admin)
 *     tags: [Clubs]
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
 *             required:
 *               - video
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tutorial added
 */
const addTutorial = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No video file uploaded' });
        }

        const { title, description } = req.body;
        const tutorial = await clubService.addTutorial(req.params.id, {
            title,
            description,
            videoUrl: req.file.path,
            publicId: req.file.filename
        });

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'ADD_TUTORIAL',
            entity: 'ClubTutorial',
            entityId: tutorial.id,
            details: { title, clubId: req.params.id },
            req
        });

        res.status(201).json({ success: true, data: sanitizeTutorial(tutorial) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/clubs/{id}/tutorials:
 *   get:
 *     summary: Get all tutorials for a club
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: List of tutorials
 */
const getTutorials = async (req, res) => {
    try {
        const tutorials = await clubService.getClubTutorials(req.params.id);
        const sanitizedTutorials = tutorials.map(t => sanitizeTutorial(t));
        res.status(200).json({ success: true, data: sanitizedTutorials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/clubs/tutorials/{tutorialId}:
 *   delete:
 *     summary: Remove a tutorial from club (Admin)
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: tutorialId
 *         required: true
 *     responses:
 *       200:
 *         description: Removed
 */
const removeTutorial = async (req, res) => {
    try {
        const result = await clubService.deleteTutorial(req.params.tutorialId);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'DELETE_TUTORIAL',
            entity: 'ClubTutorial',
            entityId: req.params.tutorialId,
            details: {},
            req
        });

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createClub,
    getAllClubs,
    getClubById,
    updateClub,
    deleteClub,
    restoreClub,
    forceDeleteClub,
    addTutorial,
    getTutorials,
    removeTutorial
};
