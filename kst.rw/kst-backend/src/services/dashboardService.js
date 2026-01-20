const { User, Blog, Club, Program, ContactMessage, Gallery } = require('../models');

const getSystemStats = async () => {
    const [
        userCount,
        blogCount,
        publishedBlogCount,
        clubCount,
        programCount,
        totalMessages,
        unreadMessages,
        galleryCount
    ] = await Promise.all([
        User.count(),
        Blog.count(),
        Blog.count({ where: { published: true } }),
        Club.count(),
        Program.count(),
        ContactMessage.count(),
        ContactMessage.count({ where: { read: false } }),
        Gallery.count()
    ]);

    return {
        users: { total: userCount },
        blogs: { total: blogCount, published: publishedBlogCount },
        clubs: { total: clubCount },
        programs: { total: programCount },
        messages: { total: totalMessages, unread: unreadMessages },
        gallery: { total: galleryCount }
    };
};

module.exports = {
    getSystemStats
};
