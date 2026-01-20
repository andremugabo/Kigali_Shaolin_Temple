const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Gallery = sequelize.define('Gallery', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    eventDate: {
        type: DataTypes.DATEONLY, // Stores just the date YYYY-MM-DD
        allowNull: false,
    },
    mediaType: {
        type: DataTypes.ENUM('IMAGE', 'VIDEO'),
        allowNull: false,
        defaultValue: 'IMAGE',
    },
    mediaUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publicId: {
        type: DataTypes.STRING,
        allowNull: false, // Important for deleting from Cloudinary
    },
    category: {
        type: DataTypes.STRING, // e.g., 'Training', 'Event', 'Ceremony'
        allowNull: true,
    }
}, {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Gallery;
