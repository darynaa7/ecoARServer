const { DataTypes } = require('sequelize');
const db = require('../../data/DBase');

const File = db.define('Files', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false,
});

module.exports = File;