const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const uploadUtils = require('../utils/uploadUtils');

// ===============================
// CLOUDINARY CONFIGURATION (Legacy - for cloud mode)
// ===============================
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'kst_gallery', // Folder name in Cloudinary
        resource_type: 'auto', // Allow images and videos
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'avi', 'webm'],
    },
});

const upload = multer({ storage: storage });

// ===============================
// UPLOAD MODE DETECTION
// ===============================
const UPLOAD_MODE = process.env.UPLOAD_MODE || 'local'; // 'local' or 'cloud'

console.log(`🔧 Upload mode: ${UPLOAD_MODE.toUpperCase()}`);

// ===============================
// EXPORTS - Dual Mode Support
// ===============================
module.exports = {
    // Legacy Cloudinary (backward compatibility)
    upload,
    cloudinary,

    // New Local Upload Utilities (from uploadUtils.js)
    uploadImage: uploadUtils.uploadImage,
    uploadVideo: uploadUtils.uploadVideo,
    uploadAny: uploadUtils.uploadAny,

    // Image Processors
    processBlogImage: uploadUtils.processBlogImage,
    processGalleryImage: uploadUtils.processGalleryImage,
    processHeroSlide: uploadUtils.processHeroSlide,
    processProgramImage: uploadUtils.processProgramImage,
    processClubImage: uploadUtils.processClubImage,
    processAboutImage: uploadUtils.processAboutImage,
    processAvatar: uploadUtils.processAvatar,

    // Video Processor
    processVideo: uploadUtils.processVideo,

    // Dual Mode Processor
    processMedia: uploadUtils.processMedia,

    // Cloud URL Handler
    acceptCloudURL: uploadUtils.acceptCloudURL,

    // Export mode for conditional logic in routes
    UPLOAD_MODE,
};
