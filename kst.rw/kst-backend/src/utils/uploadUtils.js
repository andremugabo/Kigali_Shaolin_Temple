const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const sharp = require('sharp');
const crypto = require('crypto');

// -------------------- CONFIGURATION --------------------
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
const ALLOWED_EXTENSIONS_IMAGE = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_EXTENSIONS_VIDEO = ['.mp4', '.mov', '.avi', '.webm'];

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5 MB default
const MAX_VIDEO_SIZE = parseInt(process.env.MAX_VIDEO_SIZE) || 50 * 1024 * 1024; // 50 MB default
const MAX_IMAGE_DIMENSION = parseInt(process.env.MAX_IMAGE_DIMENSION) || 10000; // Prevent decompression bombs
const IMAGE_QUALITY = parseInt(process.env.IMAGE_QUALITY) || 80;

// Image sizes for different purposes
const AVATAR_SIZE = parseInt(process.env.AVATAR_SIZE) || 300;
const BLOG_IMAGE_SIZE = parseInt(process.env.BLOG_IMAGE_SIZE) || 1200;
const GALLERY_IMAGE_SIZE = parseInt(process.env.GALLERY_IMAGE_SIZE) || 1600;
const HERO_SLIDE_SIZE = parseInt(process.env.HERO_SLIDE_SIZE) || 1920;
const PROGRAM_IMAGE_SIZE = parseInt(process.env.PROGRAM_IMAGE_SIZE) || 800;

const UPLOAD_DIR = path.join(__dirname, `../../${process.env.UPLOAD_DIR || 'uploads'}`);
const IMAGE_DIR = path.join(UPLOAD_DIR, 'images');
const VIDEO_DIR = path.join(UPLOAD_DIR, 'videos');
const AVATAR_DIR = path.join(UPLOAD_DIR, 'avatars');

// -------------------- SECURITY HELPERS --------------------

/**
 * Sanitize folder name to prevent path traversal
 */
function sanitizeFolder(folder) {
    if (!folder) return null;
    // Remove any path separators and special characters
    return folder.replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * Validate UUID format to prevent path traversal
 */
function validateUUID(id) {
    const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    if (!uuidRegex.test(id)) {
        throw new Error('Invalid ID format');
    }
    return id;
}

/**
 * Generate secure random filename
 */
function generateSecureFilename(originalExtension) {
    const randomName = crypto.randomBytes(16).toString('hex');
    const sanitizedExt = originalExtension.toLowerCase().replace(/[^a-z0-9.]/g, '');
    return `${Date.now()}-${randomName}${sanitizedExt}`;
}

/**
 * Validate file extension against whitelist
 */
function validateFileExtension(filename, allowedExtensions) {
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        throw new Error(`Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`);
    }
    return ext;
}

/**
 * Validate image dimensions to prevent decompression bombs
 */
async function validateImageDimensions(buffer) {
    try {
        const metadata = await sharp(buffer).metadata();
        if (metadata.width > MAX_IMAGE_DIMENSION || metadata.height > MAX_IMAGE_DIMENSION) {
            throw new Error(`Image dimensions exceed maximum allowed (${MAX_IMAGE_DIMENSION}px)`);
        }
        return metadata;
    } catch (err) {
        throw new Error('Invalid or corrupted image file');
    }
}

/**
 * Detect actual file type from magic numbers
 */
function detectFileType(buffer) {
    if (!buffer || buffer.length < 12) return null;

    // JPEG
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
        return 'image/jpeg';
    }

    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        return 'image/png';
    }

    // WebP (RIFF...WEBP)
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
        if (buffer.length >= 12 &&
            buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
            return 'image/webp';
        }
        // Could be AVI
        return 'video/x-msvideo';
    }

    // MP4/MOV
    if (buffer.length >= 8 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
        return 'video/mp4';
    }

    // WebM
    if (buffer[0] === 0x1A && buffer[1] === 0x45 && buffer[2] === 0xDF && buffer[3] === 0xA3) {
        return 'video/webm';
    }

    return null;
}

/**
 * Validate file content matches declared MIME type (magic number check)
 * Now with auto-correction for MIME type mismatches
 */
async function validateFileContent(buffer, declaredMimetype) {
    // Skip validation if buffer is too small
    if (!buffer || buffer.length < 12) {
        console.warn('Buffer too small for magic number validation, allowing file');
        return { isValid: true, detectedType: null };
    }

    // Detect actual file type
    const detectedType = detectFileType(buffer);

    if (!detectedType) {
        console.warn(`Could not detect file type from magic numbers, allowing file with declared type: ${declaredMimetype}`);
        return { isValid: true, detectedType: null };
    }

    // Check if detected type matches declared type
    if (detectedType !== declaredMimetype) {
        console.warn(`MIME type mismatch: declared=${declaredMimetype}, detected=${detectedType}. Auto-correcting.`);
        return { isValid: true, detectedType }; // Return detected type for correction
    }

    console.log(`✓ File type validated: ${declaredMimetype}`);
    return { isValid: true, detectedType: null }; // No correction needed
}

/**
 * Validate video file
 */
async function validateVideoFile(buffer, mimetype) {
    // Basic size check
    if (buffer.length > MAX_VIDEO_SIZE) {
        throw new Error(`Video size exceeds maximum allowed (${MAX_VIDEO_SIZE / 1024 / 1024}MB)`);
    }

    // Validate content matches MIME type
    const isValidContent = await validateFileContent(buffer, mimetype);
    if (!isValidContent) {
        throw new Error('Video content does not match declared type');
    }

    return true;
}

/**
 * Validate cloud URL format
 */
function validateCloudURL(url) {
    if (!url) throw new Error('URL is required');

    try {
        const parsed = new URL(url);
        // Allow common cloud storage domains
        const allowedDomains = [
            'cloudinary.com',
            'res.cloudinary.com',
            's3.amazonaws.com',
            'storage.googleapis.com',
            'azure.microsoft.com'
        ];

        const isAllowed = allowedDomains.some(domain => parsed.hostname.includes(domain));
        if (!isAllowed) {
            throw new Error('URL must be from an approved cloud storage provider');
        }

        return url;
    } catch (err) {
        throw new Error('Invalid URL format');
    }
}

/**
 * Ensure directory exists (async)
 */
async function ensureDir(dir) {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

/**
 * Delete old files in a directory (cleanup)
 */
async function cleanupOldFiles(dir, keepLatest = 1) {
    try {
        const files = await fs.readdir(dir);
        if (files.length <= keepLatest) return;

        // Sort by creation time (newest first)
        const fileStats = await Promise.all(
            files.map(async (file) => ({
                name: file,
                path: path.join(dir, file),
                time: (await fs.stat(path.join(dir, file))).mtime.getTime(),
            }))
        );

        fileStats.sort((a, b) => b.time - a.time);

        // Delete all except the latest N files
        const filesToDelete = fileStats.slice(keepLatest);
        await Promise.all(filesToDelete.map(file => fs.unlink(file.path).catch(() => { })));
    } catch (err) {
        // Silent failure on cleanup - not critical
        console.error('Cleanup error:', err.message);
    }
}

// -------------------- MULTER MEMORY STORAGE --------------------
const storage = multer.memoryStorage();

// -------------------- FILE FILTERS --------------------

const imageFilter = (req, file, cb) => {
    try {
        // Validate MIME type
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Allowed: JPEG, PNG, WEBP'));
        }

        // Validate file extension
        validateFileExtension(file.originalname, ALLOWED_EXTENSIONS_IMAGE);

        cb(null, true);
    } catch (err) {
        cb(err);
    }
};

const videoFilter = (req, file, cb) => {
    try {
        // Validate MIME type
        if (!ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Allowed: MP4, MOV, AVI, WEBM'));
        }

        // Validate file extension
        validateFileExtension(file.originalname, ALLOWED_EXTENSIONS_VIDEO);

        cb(null, true);
    } catch (err) {
        cb(err);
    }
};

const anyMediaFilter = (req, file, cb) => {
    try {
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);

        if (!isImage && !isVideo) {
            return cb(new Error('Invalid file type. Allowed: Images (JPEG, PNG, WEBP) or Videos (MP4, MOV, AVI, WEBM)'));
        }

        // Validate extension
        if (isImage) {
            validateFileExtension(file.originalname, ALLOWED_EXTENSIONS_IMAGE);
        } else {
            validateFileExtension(file.originalname, ALLOWED_EXTENSIONS_VIDEO);
        }

        cb(null, true);
    } catch (err) {
        cb(err);
    }
};

// -------------------- MULTER UPLOAD INSTANCES --------------------

const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1
    },
});

const uploadVideo = multer({
    storage,
    fileFilter: videoFilter,
    limits: {
        fileSize: MAX_VIDEO_SIZE,
        files: 1
    },
});

const uploadAny = multer({
    storage,
    fileFilter: anyMediaFilter,
    limits: {
        fileSize: MAX_VIDEO_SIZE, // Use larger limit
        files: 1
    },
});

// -------------------- IMAGE PROCESSING MIDDLEWARE --------------------

/**
 * Generic image processor
 * @param {string} subfolder - Subfolder within images/ (e.g., 'blogs', 'gallery')
 * @param {number} maxSize - Maximum width/height
 */
const createImageProcessor = (subfolder, maxSize) => {
    return async (req, res, next) => {
        if (!req.file) return next();

        let imageDir = null;

        try {
            // Validate file extension
            const ext = validateFileExtension(req.file.originalname, ALLOWED_EXTENSIONS_IMAGE);

            // Validate file content matches MIME type (with auto-correction)
            const validation = await validateFileContent(req.file.buffer, req.file.mimetype);
            if (!validation.isValid) {
                throw new Error('File content validation failed');
            }

            // If MIME type was corrected, update req.file
            if (validation.detectedType) {
                console.log(`Correcting MIME type from ${req.file.mimetype} to ${validation.detectedType}`);
                req.file.mimetype = validation.detectedType;
            }

            // Validate image dimensions
            await validateImageDimensions(req.file.buffer);

            // Create directory structure
            imageDir = path.join(IMAGE_DIR, subfolder);
            await ensureDir(imageDir);

            // Generate secure filename
            const filename = generateSecureFilename(ext);
            const filepath = path.join(imageDir, filename);

            // Process and save image
            await sharp(req.file.buffer)
                .resize(maxSize, maxSize, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .rotate() // Auto-rotate based on EXIF
                .withMetadata(false) // Strip EXIF data for privacy
                .toFormat(ext === '.png' ? 'png' : 'jpeg', { quality: IMAGE_QUALITY })
                .toFile(filepath);

            // Set file metadata on request object (maintains backward compatibility)
            req.file.filename = filename;
            const baseUrl = process.env.BACKEND_URL || '';
            req.file.path = `${baseUrl}/uploads/images/${subfolder}/${filename}`;
            req.file.secureFilename = filename;

            next();
        } catch (err) {
            // Clean up directory if file processing failed
            if (imageDir && req.file.filename) {
                try {
                    await fs.unlink(path.join(imageDir, req.file.filename)).catch(() => { });
                } catch { }
            }

            // Return user-friendly error
            const userError = new Error('Image upload failed: ' + err.message);
            userError.status = 400;
            next(userError);
        }
    };
};

// Specific image processors
const processBlogImage = createImageProcessor('blogs', BLOG_IMAGE_SIZE);
const processGalleryImage = createImageProcessor('gallery', GALLERY_IMAGE_SIZE);
const processHeroSlide = createImageProcessor('hero-slides', HERO_SLIDE_SIZE);
const processProgramImage = createImageProcessor('programs', PROGRAM_IMAGE_SIZE);
const processClubImage = createImageProcessor('clubs', PROGRAM_IMAGE_SIZE);
const processAboutImage = createImageProcessor('about', BLOG_IMAGE_SIZE);

// -------------------- AVATAR PROCESSING --------------------
const processAvatar = async (req, res, next) => {
    if (!req.file) return next();

    let avatarDir = null;

    try {
        // Validate and sanitize userId
        const userId = req.user?.id || req.params.userId || Date.now().toString();
        const sanitizedUserId = userId.length === 36 ? validateUUID(userId) : userId;

        // Validate file extension
        const ext = validateFileExtension(req.file.originalname, ALLOWED_EXTENSIONS_IMAGE);

        // Validate file content matches MIME type
        const isValidContent = await validateFileContent(req.file.buffer, req.file.mimetype);
        if (!isValidContent) {
            throw new Error('File content does not match declared type');
        }

        // Validate image dimensions
        await validateImageDimensions(req.file.buffer);

        // Create directory structure
        avatarDir = path.join(AVATAR_DIR, sanitizedUserId);
        await ensureDir(avatarDir);

        // Clean up old avatars (keep only the latest one)
        await cleanupOldFiles(avatarDir, 0); // Delete all before saving new one

        // Generate secure filename
        const filename = generateSecureFilename(ext);
        const filepath = path.join(avatarDir, filename);

        // Process and save avatar
        await sharp(req.file.buffer)
            .resize(AVATAR_SIZE, AVATAR_SIZE, {
                fit: 'cover',
                position: 'center'
            })
            .rotate() // Auto-rotate based on EXIF
            .withMetadata(false) // Strip EXIF data
            .toFormat(ext === '.png' ? 'png' : 'jpeg', { quality: IMAGE_QUALITY })
            .toFile(filepath);

        // Set file metadata on request object
        req.file.filename = filename;
        const baseUrl = process.env.BACKEND_URL || '';
        req.file.path = `${baseUrl}/uploads/avatars/${sanitizedUserId}/${filename}`;
        req.file.secureFilename = filename;

        next();
    } catch (err) {
        // Clean up directory if file processing failed
        if (avatarDir && req.file.filename) {
            try {
                await fs.unlink(path.join(avatarDir, req.file.filename)).catch(() => { });
            } catch { }
        }

        // Return user-friendly error
        const userError = new Error('Avatar upload failed: ' + err.message);
        userError.status = 400;
        next(userError);
    }
};

// -------------------- VIDEO PROCESSING --------------------
const processVideo = async (req, res, next) => {
    if (!req.file) return next();

    let videoDir = null;

    try {
        // Determine subfolder (gallery or club-tutorials)
        const subfolder = req.body.mediaType === 'VIDEO' ? 'gallery' : 'club-tutorials';

        // Validate file extension
        const ext = validateFileExtension(req.file.originalname, ALLOWED_EXTENSIONS_VIDEO);

        // Validate video file
        await validateVideoFile(req.file.buffer, req.file.mimetype);

        // Create directory structure
        videoDir = path.join(VIDEO_DIR, subfolder);
        await ensureDir(videoDir);

        // Generate secure filename
        const filename = generateSecureFilename(ext);
        const filepath = path.join(videoDir, filename);

        // Save video (no processing, just validation)
        await fs.writeFile(filepath, req.file.buffer);

        // Set file metadata on request object
        req.file.filename = filename;
        const baseUrl = process.env.BACKEND_URL || '';
        req.file.path = `${baseUrl}/uploads/videos/${subfolder}/${filename}`;
        req.file.secureFilename = filename;

        next();
    } catch (err) {
        // Clean up if failed
        if (videoDir && req.file.filename) {
            try {
                await fs.unlink(path.join(videoDir, req.file.filename)).catch(() => { });
            } catch { }
        }

        // Return user-friendly error
        const userError = new Error('Video upload failed: ' + err.message);
        userError.status = 400;
        next(userError);
    }
};

// -------------------- DUAL MODE MEDIA PROCESSOR --------------------
const processMedia = async (req, res, next) => {
    if (!req.file) return next();

    const isImage = ALLOWED_IMAGE_TYPES.includes(req.file.mimetype);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(req.file.mimetype);

    if (isImage) {
        return processGalleryImage(req, res, next);
    } else if (isVideo) {
        return processVideo(req, res, next);
    } else {
        const userError = new Error('Invalid media type');
        userError.status = 400;
        return next(userError);
    }
};

// -------------------- CLOUD URL MIDDLEWARE --------------------
/**
 * Middleware to accept cloud-uploaded URLs instead of file upload
 * Used when UPLOAD_MODE=cloud or when frontend uploads directly to cloud
 */
const acceptCloudURL = (req, res, next) => {
    try {
        // Check if URL provided instead of file
        const imageUrl = req.body.imageUrl || req.body.mediaUrl || req.body.videoUrl;

        if (imageUrl) {
            // Validate URL
            validateCloudURL(imageUrl);

            // Create fake req.file object for backward compatibility
            req.file = {
                path: imageUrl,
                filename: path.basename(new URL(imageUrl).pathname),
                secureFilename: path.basename(new URL(imageUrl).pathname),
                mimetype: req.body.mimetype || 'image/jpeg', // Default
                size: 0 // Unknown
            };
        }

        next();
    } catch (err) {
        const userError = new Error('Cloud URL validation failed: ' + err.message);
        userError.status = 400;
        next(userError);
    }
};

// -------------------- INITIALIZATION --------------------
// Ensure upload directories exist on module load
(async () => {
    try {
        if (!fsSync.existsSync(UPLOAD_DIR)) {
            await ensureDir(UPLOAD_DIR);
        }
        if (!fsSync.existsSync(IMAGE_DIR)) {
            await ensureDir(IMAGE_DIR);
        }
        if (!fsSync.existsSync(VIDEO_DIR)) {
            await ensureDir(VIDEO_DIR);
        }
        if (!fsSync.existsSync(AVATAR_DIR)) {
            await ensureDir(AVATAR_DIR);
        }

        // Create subfolders
        const imageFolders = ['blogs', 'gallery', 'hero-slides', 'programs', 'clubs', 'about'];
        const videoFolders = ['gallery', 'club-tutorials'];

        for (const folder of imageFolders) {
            await ensureDir(path.join(IMAGE_DIR, folder));
        }

        for (const folder of videoFolders) {
            await ensureDir(path.join(VIDEO_DIR, folder));
        }

        console.log('✅ Upload directories initialized successfully');
    } catch (err) {
        console.error('❌ Failed to create upload directories:', err.message);
    }
})();

// -------------------- EXPORTS --------------------
module.exports = {
    // Multer upload instances
    uploadImage,
    uploadVideo,
    uploadAny,

    // Image processors (specific)
    processBlogImage,
    processGalleryImage,
    processHeroSlide,
    processProgramImage,
    processClubImage,
    processAboutImage,
    processAvatar,

    // Video processor
    processVideo,

    // Dual mode processor
    processMedia,

    // Cloud URL handler
    acceptCloudURL,

    // Security validators (exported for testing)
    validateUUID,
    validateFileExtension,
    validateImageDimensions,
    validateFileContent,
    validateVideoFile,
    validateCloudURL,
    sanitizeFolder,
    generateSecureFilename,
};
