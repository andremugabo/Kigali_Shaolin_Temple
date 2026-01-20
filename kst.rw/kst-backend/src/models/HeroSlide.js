const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const HeroSlide = sequelize.define('HeroSlide', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    button_text: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    button_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = HeroSlide;
