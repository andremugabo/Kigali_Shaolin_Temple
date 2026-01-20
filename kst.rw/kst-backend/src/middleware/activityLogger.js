const { logAction } = require('../services/auditLogService');

const logView = (entity) => {
    return async (req, res, next) => {
        // We need to wait for the response to finish or just log immediately?
        // Usually log after ensuring resource exists, but middleware runs before controller.
        // For simple "Attempted View" or "Viewed", running it here is easiest.
        // To be precise (only log if found), we'd need to hook into res.on('finish') or do it in controller.
        // Let's do it in controller for precision, OR here for "Access Attempt".
        // Requirement: "verify what any user or guest did and viewed"
        // Let's use a "tap" approach: allow request to proceed, then log if status is 200.

        const originalSend = res.send;
        res.send = function (data) {
            res.send = originalSend; // restore

            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Try to get user ID if authenticated (authMiddleware runs before this?)
                // If this is public route, req.user might be undefined.
                // We can check if token exists manually or relies on optional auth.

                const userId = req.user ? req.user.id : null;
                const entityId = req.params.id || null;

                logAction({
                    userId,
                    action: 'VIEW',
                    entity,
                    entityId,
                    details: { url: req.originalUrl, method: req.method },
                    req
                });
            }
            return originalSend.apply(res, arguments);
        };
        next();
    };
};

module.exports = { logView };
