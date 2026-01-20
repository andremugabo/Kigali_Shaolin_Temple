const sequelize = require('../../db');
const User = require('./User');
const HeroSlide = require('./HeroSlide');
const About = require('./About');
const Program = require('./Program');
const Blog = require('./Blog');
const Club = require('./Club');
const ContactMessage = require('./ContactMessage');
const AuditLog = require('./AuditLog');
const Gallery = require('./Gallery');
const ClubTutorial = require('./ClubTutorial');

// Define Associations
User.hasMany(Blog, { foreignKey: 'userId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });

User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Club.hasMany(ClubTutorial, { foreignKey: 'clubId', as: 'tutorials' });
ClubTutorial.belongsTo(Club, { foreignKey: 'clubId', as: 'club' });

const models = {
    User,
    HeroSlide,
    About,
    Program,
    Blog,
    Club,
    ContactMessage,
    AuditLog,
    Gallery,
    ClubTutorial,
    sequelize
};

module.exports = models;
