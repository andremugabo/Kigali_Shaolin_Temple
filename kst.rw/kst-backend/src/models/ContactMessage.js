const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const ContactMessage = sequelize.define('ContactMessage', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    paranoid: true,
});

module.exports = ContactMessage;
