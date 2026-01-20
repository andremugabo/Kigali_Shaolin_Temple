const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

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
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'avi'],
    },
});

const upload = multer({ storage: storage });

module.exports = {
    upload,
    cloudinary // Export configured instance for deletion later
};
