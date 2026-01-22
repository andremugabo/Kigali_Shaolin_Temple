const { Blog, User } = require('../models');

const createBlog = async (data) => {
    return await Blog.create(data);
};

const getAllBlogs = async (page = 1, limit = 10, category = null) => {
    const offset = (page - 1) * limit;
    const where = category ? { category } : {};

    const { count, rows } = await Blog.findAndCountAll({
        where,
        include: [{ model: User, as: 'author', attributes: ['name', 'email', 'image'] }],
        offset,
        limit,
        order: [['created_at', 'DESC']],
    });
    return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        blogs: rows,
    };
};

const getBlogById = async (id) => {
    return await Blog.findByPk(id, {
        include: [{ model: User, as: 'author', attributes: ['name', 'email', 'image'] }],
    });
};

const updateBlog = async (id, data) => {
    const blog = await Blog.findByPk(id);
    if (!blog) throw new Error('Blog not found');
    return await blog.update(data);
};

const deleteBlog = async (id) => {
    const blog = await Blog.findByPk(id);
    if (!blog) throw new Error('Blog not found');
    await blog.destroy();
    return { message: 'Blog deleted successfully' };
};

const restoreBlog = async (id) => {
    const blog = await Blog.findByPk(id, { paranoid: false });
    if (!blog) throw new Error('Blog not found');
    await blog.restore();
    return { message: 'Blog restored successfully' };
};

const forceDeleteBlog = async (id) => {
    const blog = await Blog.findByPk(id, { paranoid: false });
    if (!blog) throw new Error('Blog not found');
    await blog.destroy({ force: true });
    return { message: 'Blog permanently deleted' };
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    restoreBlog,
    forceDeleteBlog,
};
