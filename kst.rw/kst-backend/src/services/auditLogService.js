const { AuditLog, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Log an action performed by a user or guest.
 * 
 * @param {Object} params - The log parameters.
 * @param {string|null} params.userId - The ID of the user (or null for guest).
 * @param {string} params.action - The action performed (e.g., 'LOGIN', 'VIEW', 'CREATE').
 * @param {string} params.entity - The entity affected (e.g., 'Blog', 'User').
 * @param {string} params.entityId - The ID of the affected entity.
 * @param {Object|string} params.details - Additional details about the action.
 * @param {Object} req - The Express request object (to extract IP and User Agent).
 */
const logAction = async ({ userId, action, entity, entityId, details, req }) => {
    try {
        const ipAddress = req ? (req.headers['x-forwarded-for'] || req.connection.remoteAddress) : null;
        const userAgent = req ? req.headers['user-agent'] : null;

        await AuditLog.create({
            userId: userId || null,
            action,
            entity,
            entityId: entityId ? String(entityId) : null,
            details: details ? JSON.stringify(details) : null,
            ipAddress,
            userAgent,
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Do not throw error to avoid failing the main request
    }
};

/**
 * Get audit logs with pagination and filtering.
 * 
 * @param {Object} filters - Filters for criteria (action, entity, userId).
 * @param {number} page - Page number.
 * @param {number} limit - Items per page.
 * @returns {Object} - Pagination result { logs, totalItems, totalPages, currentPage }.
 */
const getLogs = async (filters = {}, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (filters.action) whereClause.action = filters.action;
    if (filters.entity) whereClause.entity = filters.entity;
    if (filters.userId) whereClause.userId = filters.userId;

    const { count, rows } = await AuditLog.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['name', 'email', 'image'], // consistent with user privacy
                required: false
            }
        ]
    });

    return {
        logs: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    };
};

module.exports = {
    logAction,
    getLogs
};
