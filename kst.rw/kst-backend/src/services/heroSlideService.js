const { HeroSlide } = require('../models');

const createSlide = async (data) => {
    return await HeroSlide.create(data);
};

const getAllSlides = async () => {
    return await HeroSlide.findAll();
};

const getSlideById = async (id) => {
    return await HeroSlide.findByPk(id);
};

const updateSlide = async (id, data) => {
    const slide = await HeroSlide.findByPk(id);
    if (!slide) throw new Error('Slide not found');
    return await slide.update(data);
};

const deleteSlide = async (id) => {
    const slide = await HeroSlide.findByPk(id);
    if (!slide) throw new Error('Slide not found');
    await slide.destroy();
    return { message: 'Slide deleted successfully' };
};

module.exports = {
    createSlide,
    getAllSlides,
    getSlideById,
    updateSlide,
    deleteSlide,
};
