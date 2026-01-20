const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const ClubTutorial = sequelize.define('ClubTutorial', {
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
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publicId: {
        type: DataTypes.STRING,
        allowNull: false, // For Cloudinary deletion
    },
    clubId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Clubs',
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
}, {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = ClubTutorial;
