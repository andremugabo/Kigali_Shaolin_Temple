const { Club, ClubTutorial } = require('../models');
const { cloudinary } = require('../middleware/uploadMiddleware');

const createClub = async (data) => {
    return await Club.create(data);
};

const getAllClubs = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Club.findAndCountAll({
        include: [{ model: ClubTutorial, as: 'tutorials' }],
        offset,
        limit,
        order: [['created_at', 'DESC']],
    });
    return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        clubs: rows,
    };
};

const getClubById = async (id) => {
    return await Club.findByPk(id, {
        include: [{ model: ClubTutorial, as: 'tutorials' }]
    });
};

const updateClub = async (id, data) => {
    const club = await Club.findByPk(id);
    if (!club) throw new Error('Club not found');
    return await club.update(data);
};

const deleteClub = async (id) => {
    const club = await Club.findByPk(id);
    if (!club) throw new Error('Club not found');
    await club.destroy();
    return { message: 'Club deleted successfully' };
};

const restoreClub = async (id) => {
    const club = await Club.findByPk(id, { paranoid: false });
    if (!club) throw new Error('Club not found');
    await club.restore();
    return { message: 'Club restored successfully' };
};

const forceDeleteClub = async (id) => {
    const club = await Club.findByPk(id, { paranoid: false });
    if (!club) throw new Error('Club not found');
    await club.destroy({ force: true });
    return { message: 'Club permanently deleted' };
};

// --- Tutorial Methods ---

const addTutorial = async (clubId, data) => {
    const club = await Club.findByPk(clubId);
    if (!club) throw new Error('Club not found');

    return await ClubTutorial.create({ ...data, clubId });
};

const getClubTutorials = async (clubId) => {
    return await ClubTutorial.findAll({ where: { clubId } });
};

const deleteTutorial = async (tutorialId) => {
    const tutorial = await ClubTutorial.findByPk(tutorialId);
    if (!tutorial) throw new Error('Tutorial not found');

    // Delete from Cloudinary
    if (tutorial.publicId) {
        await cloudinary.uploader.destroy(tutorial.publicId, { resource_type: 'video' });
    }

    await tutorial.destroy();
    return { message: 'Tutorial deleted successfully' };
};

module.exports = {
    createClub,
    getAllClubs,
    getClubById,
    updateClub,
    deleteClub,
    restoreClub,
    forceDeleteClub,
    addTutorial,
    getClubTutorials,
    deleteTutorial
};
