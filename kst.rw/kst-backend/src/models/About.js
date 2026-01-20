const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const About = sequelize.define('About', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    founder_name: {
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
    tableName: 'Abouts' // Force table name if needed, though Sequelize pluralizes usually
});

module.exports = About;
