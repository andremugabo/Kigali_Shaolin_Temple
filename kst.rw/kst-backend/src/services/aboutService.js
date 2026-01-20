const { About } = require('../models');

const createAbout = async (data) => {
    // Ensure only one About record exists if that's the requirement, 
    // or just create new ones. Assuming singular for CMS usually:
    const count = await About.count();
    if (count > 0) throw new Error('About section already exists. Update it instead.');
    return await About.create(data);
};

const getAbout = async () => {
    // Get the first one
    return await About.findOne();
};

const updateAbout = async (id, data) => {
    const about = await About.findByPk(id);
    if (!about) throw new Error('About section not found');
    return await about.update(data);
};

module.exports = {
    createAbout,
    getAbout,
    updateAbout,
};
