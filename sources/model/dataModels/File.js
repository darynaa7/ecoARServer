const { DataTypes } = require('sequelize');
const db = require('../../data/DBase');

const File = db.define('Files', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false,
});

module.exports = File;