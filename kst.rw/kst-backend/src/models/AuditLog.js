const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true, // Nullable for guests
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false, // e.g., 'LOGIN', 'VIEW', 'CREATE', 'UPDATE', 'DELETE'
    },
    entity: {
        type: DataTypes.STRING,
        allowNull: true, // e.g., 'Blog', 'User', 'Program'
    },
    entityId: {
        type: DataTypes.STRING,
        allowNull: true, // ID of the affected entity
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true, // JSON string or text description
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    paranoid: true,
});

module.exports = AuditLog;
