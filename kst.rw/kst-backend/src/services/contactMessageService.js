const { ContactMessage } = require('../models');

const createMessage = async (data) => {
    return await ContactMessage.create(data);
};

const getAllMessages = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await ContactMessage.findAndCountAll({
        order: [['created_at', 'DESC']],
        limit,
        offset
    });

    return {
        messages: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    };
};

const getMessageById = async (id) => {
    const message = await ContactMessage.findByPk(id);
    if (!message) throw new Error('Message not found');
    return message;
};

const markAsRead = async (id) => {
    const message = await ContactMessage.findByPk(id);
    if (!message) throw new Error('Message not found');
    return await message.update({ read: true });
};

const deleteMessage = async (id) => {
    const message = await ContactMessage.findByPk(id);
    if (!message) throw new Error('Message not found');
    await message.destroy();
    return { message: 'Message deleted successfully' };
};

const restoreMessage = async (id) => {
    const message = await ContactMessage.findByPk(id, { paranoid: false });
    if (!message) {
        throw new Error('Message not found');
    }
    await message.restore();
    return { message: 'Message restored successfully' };
};

const forceDeleteMessage = async (id) => {
    const message = await ContactMessage.findByPk(id, { paranoid: false });
    if (!message) {
        throw new Error('Message not found');
    }
    await message.destroy({ force: true });
    return { message: 'Message permanently deleted' };
};

module.exports = {
    createMessage,
    getAllMessages,
    getMessageById,
    markAsRead,
    deleteMessage,
    restoreMessage,
    forceDeleteMessage,
};
