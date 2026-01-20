const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const createUser = async (userData) => {
    const { name, email, password, role, image } = userData;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash the initial password (even though they will reset it, we need a placeholder)
    // If Admin didn't provide one, generate a random one
    const initialPassword = password || crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(initialPassword, 10);

    // Generate Verification/Reset Token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash token to store in DB
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Token expires in 24 hours
    const resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'Editor',
        image,
        resetPasswordToken,
        resetPasswordExpires,
    });

    // Send Invitation Email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    const message = `
        <h1>You have been invited to join the KST Platform</h1>
        <p>Please click the link below to set your password and activate your account:</p>
        <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
        <p>This link will expire in 24 hours.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Account Invitation - Set Your Password',
            html: message,
        });
    } catch (error) {
        // If email fails, we might want to log it or undo user creation, 
        // but for now we'll just log the error so the admin knows.
        console.error('Email could not be sent', error);
        // Optionally: throw new Error('Email could not be sent');
    }

    return user;
};

const getAllUsers = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({
        attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
        offset,
        limit,
        order: [['created_at', 'DESC']],
    });
    return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        users: rows,
    };
};

const getUserById = async (id) => {
    return await User.findByPk(id, { attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] } });
};

const updateUser = async (id, userData) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');

    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    return await user.update(userData);
};

const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy(); // Soft delete
    return { message: 'User deleted successfully' };
};

const restoreUser = async (id) => {
    const user = await User.findByPk(id, { paranoid: false });
    if (!user) throw new Error('User not found');
    await user.restore();
    return { message: 'User restored successfully' };
};

const forceDeleteUser = async (id) => {
    const user = await User.findByPk(id, { paranoid: false });
    if (!user) throw new Error('User not found');
    await user.destroy({ force: true });
    return { message: 'User permanently deleted' };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret_key', // Fallback for dev
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return { user, token };
};

// --- Profile Management ---

const getProfile = async (userId) => {
    const user = await User.findByPk(userId, { attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] } });
    if (!user) throw new Error('User not found');
    return user;
};

const updateProfile = async (userId, updateData) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    delete updateData.role;

    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return await user.update(updateData);
};

// --- Password Reset ---

const resetPassword = async (resetToken, newPassword) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await User.findOne({
        where: {
            resetPasswordToken,
            resetPasswordExpires: { [require('sequelize').Op.gt]: Date.now() },
        },
    });

    if (!user) {
        throw new Error('Invalid token');
    }

    // Set new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return { user, token };
};

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    restoreUser,
    forceDeleteUser,
    getProfile,
    updateProfile,
    resetPassword,
};
