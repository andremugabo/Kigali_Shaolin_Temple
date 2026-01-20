const { userService, auditLogService } = require('../services');
const { encodeUUID } = require('../utils/idUtils');

// Helper to sanitize and encode user
const sanitizeUser = (user) => {
    if (!user) return null;
    const plainUser = user.toJSON ? user.toJSON() : user;
    delete plainUser.password; // Remove password
    delete plainUser.resetPasswordToken;
    delete plainUser.resetPasswordExpires;
    return {
        ...plainUser,
        id: encodeUUID(plainUser.id) // Encode the UUID
    };
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (Admin)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Optional. Auto-generated if not provided.
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully. Invitation email sent.
 *       500:
 *         description: Server error
 * */
const createUser = async (req, res) => {
    try {
        const userData = { ...req.body };
        if (req.file) {
            userData.image = req.file.path; // Cloudinary URL
        }

        const user = await userService.createUser(userData);
        res.status(201).json({ success: true, data: sanitizeUser(user), message: 'User created and invitation sent.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Server error
 */
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const data = await userService.getAllUsers(page, limit);

        // Encode IDs in the user list
        data.users = data.users.map(u => sanitizeUser(u));

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: sanitizeUser(user) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user (Admin)
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated
 */
const updateUser = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        const user = await userService.updateUser(req.params.id, updateData);
        res.status(200).json({ success: true, data: sanitizeUser(user) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Soft delete user (Admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: User deleted
 */
const deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/users/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted user (Admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: User restored
 */
const restoreUser = async (req, res) => {
    try {
        const result = await userService.restoreUser(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/users/{id}/force:
 *   delete:
 *     summary: Permanently delete user (Admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: User permanently deleted
 */
const forceDeleteUser = async (req, res) => {
    try {
        const result = await userService.forceDeleteUser(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);

        // Log Login Action
        await auditLogService.logAction({
            userId: result.user.id, // Use raw ID for internal logging
            action: 'LOGIN',
            entity: 'User',
            entityId: result.user.id,
            details: { email },
            req
        });

        // Encode ID for response
        result.user = sanitizeUser(result.user);

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

// --- Profile Controllers ---

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: User not found
 */
const getProfile = async (req, res) => {
    try {
        // req.user.id comes from authMiddleware
        const user = await userService.getProfile(req.user.id);
        res.status(200).json({ success: true, data: sanitizeUser(user) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update current user profile (info, password, image)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated
 */
const updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        const user = await userService.updateProfile(req.user.id, updateData);
        res.status(200).json({ success: true, data: sanitizeUser(user) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Password Reset ---

/**
 * @swagger
 * /api/users/reset-password/{token}:
 *   post:
 *     summary: Reset password with token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const result = await userService.resetPassword(req.params.token, password);

        // Log
        await auditLogService.logAction({
            userId: result.user.id,
            action: 'RESET_PASSWORD',
            entity: 'User',
            entityId: result.user.id,
            details: { message: 'Password reset via token' },
            req
        });

        res.status(200).json({ success: true, message: 'Password reset successful', token: result.token });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    restoreUser,
    forceDeleteUser,
    login,
    getProfile,
    updateProfile,
    resetPassword,
};
