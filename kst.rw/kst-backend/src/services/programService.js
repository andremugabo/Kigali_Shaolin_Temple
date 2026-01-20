const { Program } = require('../models');

const createProgram = async (data) => {
    return await Program.create(data);
};

const getAllPrograms = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Program.findAndCountAll({
        offset,
        limit,
        order: [['created_at', 'DESC']],
    });
    return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        programs: rows,
    };
};

const getProgramById = async (id) => {
    return await Program.findByPk(id);
};

const updateProgram = async (id, data) => {
    const program = await Program.findByPk(id);
    if (!program) throw new Error('Program not found');
    return await program.update(data);
};

const deleteProgram = async (id) => {
    const program = await Program.findByPk(id);
    if (!program) throw new Error('Program not found');
    await program.destroy();
    return { message: 'Program deleted successfully' };
};

const restoreProgram = async (id) => {
    const program = await Program.findByPk(id, { paranoid: false });
    if (!program) throw new Error('Program not found');
    await program.restore();
    return { message: 'Program restored successfully' };
};

const forceDeleteProgram = async (id) => {
    const program = await Program.findByPk(id, { paranoid: false });
    if (!program) throw new Error('Program not found');
    await program.destroy({ force: true });
    return { message: 'Program permanently deleted' };
};

module.exports = {
    createProgram,
    getAllPrograms,
    getProgramById,
    updateProgram,
    deleteProgram,
    restoreProgram,
    forceDeleteProgram,
};
