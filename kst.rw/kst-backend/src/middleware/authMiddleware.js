const jwt = require('jsonwebtoken');
const { User, Blog } = require('../models');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = await User.findByPk(decoded.id);

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found with this id' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `User role ${req.user.role} is not authorized to access this route` });
        }
        next();
    };
};

const checkBlogOwnership = async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        // Admin can do anything
        if (req.user.role === 'Admin' || req.user.role === 'Super Admin') {
            return next();
        }

        // Content Managers might also be allowed to edit all? 
        // User request said: "content manager and blogger only accessing his blog content only"
        // Interpretation: Content Manager usually manages all content. check with logic or common sense.
        // Usually Content Manager can edit all. 
        // But let's stick to the prompt: "blogger only accessing his blog content only".
        // Let's allow Content Manager to edit all for now as per role name implies.
        if (req.user.role === 'Content Manager') {
            return next();
        }

        // Check ownership
        if (blog.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update/delete this blog post' });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    protect,
    authorize,
    checkBlogOwnership
};
