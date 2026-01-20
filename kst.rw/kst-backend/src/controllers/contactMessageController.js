const { contactMessageService } = require('../services');
const { encodeUUID } = require('../utils/idUtils');

// Helper to sanitize and encode message
const sanitizeMessage = (message) => {
    if (!message) return null;
    const plainMessage = message.toJSON ? message.toJSON() : message;
    return {
        ...plainMessage,
        id: encodeUUID(plainMessage.id)
    };
};

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Contact messages management
 */

/**
 * @swagger
 * /api/contact-messages:
 *   post:
 *     summary: Submit a contact message (Public)
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
const createMessage = async (req, res) => {
    try {
        const message = await contactMessageService.createMessage(req.body);
        res.status(201).json({ success: true, data: sanitizeMessage(message) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/contact-messages:
 *   get:
 *     summary: Get all messages (Admin)
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of messages
 */
const getAllMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const messages = await contactMessageService.getAllMessages(page, limit);
        // Encode IDs in the message list
        if (messages.messages) {
            messages.messages = messages.messages.map(m => sanitizeMessage(m));
        }

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/contact-messages/{id}:
 *   get:
 *     summary: Get message details (Admin)
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Message details
 */
const getMessageById = async (req, res) => {
    try {
        const message = await contactMessageService.getMessageById(req.params.id);
        res.status(200).json({ success: true, data: sanitizeMessage(message) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @swagger
 * /api/contact-messages/{id}/read:
 *   patch:
 *     summary: Mark message as read (Admin)
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Updated
 */
const markAsRead = async (req, res) => {
    try {
        const message = await contactMessageService.markAsRead(req.params.id);
        res.status(200).json({ success: true, data: sanitizeMessage(message) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/contact-messages/{id}:
 *   delete:
 *     summary: Soft delete message (Admin)
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
const deleteMessage = async (req, res) => {
    try {
        const result = await contactMessageService.deleteMessage(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @swagger
 * /api/contact-messages/{id}/restore:
 *   patch:
 *     summary: Restore soft-deleted message (Admin)
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Restored
 */
const restoreMessage = async (req, res) => {
    try {
        const result = await contactMessageService.restoreMessage(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/contact-messages/{id}/force:
 *   delete:
 *     summary: Permanently delete message (Admin)
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Permanently deleted
 */
const forceDeleteMessage = async (req, res) => {
    try {
        const result = await contactMessageService.forceDeleteMessage(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createMessage,
    getAllMessages,
    getMessageById,
    markAsRead,
    deleteMessage,
    restoreMessage,
    forceDeleteMessage,
};
