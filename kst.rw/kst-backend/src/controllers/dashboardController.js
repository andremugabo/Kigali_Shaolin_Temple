const { dashboardService } = require('../services');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin dashboard statistics
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get overview statistics for the admin dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       500:
 *         description: Server error
 */
const getStats = async (req, res) => {
    try {
        const stats = await dashboardService.getSystemStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getStats
};
