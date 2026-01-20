const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Club = sequelize.define('Club', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Club;
