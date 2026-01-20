const { auditLogService } = require('../services');
const { encodeUUID } = require('../utils/idUtils');

/**
 * @swagger
 * tags:
 *   name: AuditLogs
 *   description: Audit Log management (Admin only)
 */

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: Get all audit logs
 *     tags: [AuditLogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *         description: Filter by entity type
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by User ID
 *     responses:
 *       200:
 *         description: List of audit logs
 *       500:
 *         description: Server error
 */
const getLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const filters = {
            action: req.query.action,
            entity: req.query.entity,
            userId: req.query.userId
        };

        const result = await auditLogService.getLogs(filters, page, limit);

        // Encode IDs if necessary, though logs are internal admin tools usually
        if (result.logs) {
            result.logs = result.logs.map(log => {
                const plainLog = log.toJSON ? log.toJSON() : log;
                if (plainLog.userId) plainLog.userId = encodeUUID(plainLog.userId);
                // ID of log itself
                plainLog.id = encodeUUID(plainLog.id);
                return plainLog;
            });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getLogs
};
