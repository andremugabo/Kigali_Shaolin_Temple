const { programService, auditLogService } = require('../services'); // Added auditLogService
const { encodeUUID } = require('../utils/idUtils');

// Helper to sanitize and encode program
const sanitizeProgram = (program) => {
    if (!program) return null;
    const plainProgram = program.toJSON ? program.toJSON() : program;
    return {
        ...plainProgram,
        id: encodeUUID(plainProgram.id)
    };
};

/**
 * @swagger
 * tags:
 *   name: Programs
 *   description: Program management
 */

/**
 * @swagger
 * /api/programs:
 *   post:
 *     summary: Create a new program (Admin)
 *     tags: [Programs]
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
 *               image:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Program created
 */
const createProgram = async (req, res) => {
    try {
        const programData = { ...req.body };

        // Normalize status to lowercase
        if (programData.status) {
            programData.status = programData.status.toLowerCase();
        }

        if (req.file) {
            programData.image = req.file.path;
        }

        const program = await programService.createProgram(programData);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'CREATE',
            entity: 'Program',
            entityId: program.id,
            details: { name: program.name },
            req
        });

        res.status(201).json({ success: true, data: sanitizeProgram(program) });
    } catch (error) {
        console.error('Create Program Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     responses:
 *       200:
 *         description: List of programs
 */
const getAllPrograms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const data = await programService.getAllPrograms(page, limit);
        // Encode IDs in the program list
        if (data.programs) {
            data.programs = data.programs.map(p => sanitizeProgram(p));
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/programs/{id}:
 *   get:
 *     summary: Get program by ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Program details
 */
const getProgramById = async (req, res) => {
    try {
        const program = await programService.getProgramById(req.params.id);
        if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
        res.status(200).json({ success: true, data: sanitizeProgram(program) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/programs/{id}:
 *   put:
 *     summary: Update program (Admin)
 *     tags: [Programs]
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
 *               image:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Program updated
 */
const updateProgram = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Normalize status to lowercase
        if (updateData.status) {
            updateData.status = updateData.status.toLowerCase();
        }

        if (req.file) {
            updateData.image = req.file.path;
        }

        const program = await programService.updateProgram(req.params.id, updateData);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'UPDATE',
            entity: 'Program',
            entityId: program.id,
            details: { name: program.name },
            req
        });

        res.status(200).json({ success: true, data: sanitizeProgram(program) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/programs/{id}:
 *   delete:
 *     summary: Soft delete program (Admin)
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
const deleteProgram = async (req, res) => {
    try {
        const result = await programService.deleteProgram(req.params.id);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'DELETE',
            entity: 'Program',
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
 * /api/programs/{id}/restore:
 *   patch:
 *     summary: Restore soft-deleted program (Admin)
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Restored
 */
const restoreProgram = async (req, res) => {
    try {
        const result = await programService.restoreProgram(req.params.id);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'RESTORE',
            entity: 'Program',
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
 * /api/programs/{id}/force:
 *   delete:
 *     summary: Permanently delete program (Admin)
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Permanently deleted
 */
const forceDeleteProgram = async (req, res) => {
    try {
        const result = await programService.forceDeleteProgram(req.params.id);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'FORCE_DELETE',
            entity: 'Program',
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
    createProgram,
    getAllPrograms,
    getProgramById,
    updateProgram,
    deleteProgram,
    restoreProgram,
    forceDeleteProgram,
};
