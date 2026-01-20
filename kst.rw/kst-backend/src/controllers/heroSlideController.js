const { heroSlideService, auditLogService } = require('../services'); // Added auditLogService
const { encodeUUID } = require('../utils/idUtils');

// Helper to sanitize and encode hero slide
const sanitizeSlide = (slide) => {
    if (!slide) return null;
    const plainSlide = slide.toJSON ? slide.toJSON() : slide;
    return {
        ...plainSlide,
        id: encodeUUID(plainSlide.id)
    };
};

/**
 * @swagger
 * tags:
 *   name: HeroSlides
 *   description: Hero Slider management
 */

/**
 * @swagger
 * /api/hero-slides:
 *   post:
 *     summary: Create a new slide (Admin)
 *     tags: [HeroSlides]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               button_text:
 *                 type: string
 *               button_link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Slide created
 */
const createSlide = async (req, res) => {
    try {
        const slideData = { ...req.body };
        if (req.file) {
            slideData.image = req.file.path;
        }

        const slide = await heroSlideService.createSlide(slideData);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'CREATE',
            entity: 'HeroSlide',
            entityId: slide.id,
            details: { title: slide.title },
            req
        });

        res.status(201).json({ success: true, data: sanitizeSlide(slide) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/hero-slides:
 *   get:
 *     summary: Get all slides
 *     tags: [HeroSlides]
 *     responses:
 *       200:
 *         description: List of slides
 */
const getAllSlides = async (req, res) => {
    try {
        const slides = await heroSlideService.getAllSlides();
        const sanitizedSlides = slides.map(s => sanitizeSlide(s));
        res.status(200).json({ success: true, data: sanitizedSlides });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/hero-slides/{id}:
 *   get:
 *     summary: Get slide by ID
 *     tags: [HeroSlides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Slide details
 */
const getSlideById = async (req, res) => {
    try {
        const slide = await heroSlideService.getSlideById(req.params.id);
        if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });
        res.status(200).json({ success: true, data: sanitizeSlide(slide) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @swagger
 * /api/hero-slides/{id}:
 *   put:
 *     summary: Update slide (Admin)
 *     tags: [HeroSlides]
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
 *               subtitle:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               button_text:
 *                 type: string
 *               button_link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Slide updated
 */
const updateSlide = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        const slide = await heroSlideService.updateSlide(req.params.id, updateData);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'UPDATE',
            entity: 'HeroSlide',
            entityId: slide.id,
            details: { title: slide.title },
            req
        });

        res.status(200).json({ success: true, data: sanitizeSlide(slide) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @swagger
 * /api/hero-slides/{id}:
 *   delete:
 *     summary: Delete slide (Admin)
 *     tags: [HeroSlides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
const deleteSlide = async (req, res) => {
    try {
        const result = await heroSlideService.deleteSlide(req.params.id);

        // Log
        await auditLogService.logAction({
            userId: req.user ? req.user.id : null,
            action: 'DELETE',
            entity: 'HeroSlide',
            entityId: req.params.id,
            details: {},
            req
        });

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    createSlide,
    getAllSlides,
    getSlideById,
    updateSlide,
    deleteSlide
};
