const { Gallery } = require('../models');
const { cloudinary } = require('../middleware/uploadMiddleware');

const createGalleryItem = async (data) => {
    return await Gallery.create(data);
};

const getAllGalleryItems = async (filter = {}, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (filter.category) whereClause.category = filter.category;
    if (filter.mediaType) whereClause.mediaType = filter.mediaType;
    if (filter.eventDate) whereClause.eventDate = filter.eventDate;

    const { count, rows } = await Gallery.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['eventDate', 'DESC']], // Newest events first
    });

    return {
        items: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    };
};

const getGalleryItemById = async (id) => {
    return await Gallery.findByPk(id);
};

const updateGalleryItem = async (id, data) => {
    const item = await Gallery.findByPk(id);
    if (!item) throw new Error('Gallery item not found');

    return await item.update(data);
};

const deleteGalleryItem = async (id) => {
    const item = await Gallery.findByPk(id);
    if (!item) throw new Error('Gallery item not found');

    // DO NOT Delete from Cloudinary on soft delete
    // Only delete from DB (soft delete)
    await item.destroy();
    return { message: 'Gallery item deleted successfully' };
};

const restoreGalleryItem = async (id) => {
    const item = await Gallery.findByPk(id, { paranoid: false });
    if (!item) {
        throw new Error('Gallery item not found');
    }
    await item.restore();
    return { message: 'Gallery item restored successfully' };
};

const forceDeleteGalleryItem = async (id) => {
    const item = await Gallery.findByPk(id, { paranoid: false });
    if (!item) {
        throw new Error('Gallery item not found');
    }

    // Permanently delete from Cloudinary
    if (item.publicId) {
        const resourceType = item.mediaType === 'VIDEO' ? 'video' : 'image';
        await cloudinary.uploader.destroy(item.publicId, { resource_type: resourceType });
    }

    await item.destroy({ force: true });
    return { message: 'Gallery item permanently deleted' };
};

module.exports = {
    createGalleryItem,
    getAllGalleryItems,
    getGalleryItemById,
    updateGalleryItem,
    deleteGalleryItem,
    restoreGalleryItem,
    forceDeleteGalleryItem,
};
