const { decodeUUID } = require('../utils/idUtils');

/**
 * Middleware to decode specific route parameters from Base64URL to UUID.
 * @param {string} paramName - The name of the parameter to decode (default: 'id').
 */
const decodeParam = (paramName = 'id') => {
    return (req, res, next) => {
        if (req.params[paramName]) {
            req.params[paramName] = decodeUUID(req.params[paramName]);
        }
        next();
    };
};

module.exports = {
    decodeParam
};
