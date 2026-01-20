const userController = require('./userController');
const blogController = require('./blogController');
const heroSlideController = require('./heroSlideController');
const aboutController = require('./aboutController');
const programController = require('./programController');
const clubController = require('./clubController');
const contactMessageController = require('./contactMessageController');
const galleryController = require('./galleryController');
const dashboardController = require('./dashboardController');

module.exports = {
    userController,
    blogController,
    heroSlideController,
    aboutController,
    programController,
    clubController,
    contactMessageController,
    galleryController,
    dashboardController,
    auditLogController: require('./auditLogController'),
};
