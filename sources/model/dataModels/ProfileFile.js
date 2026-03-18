const { DataTypes } = require('sequelize');
const db = require('../../data/DBase');
const User = require("./User");
const File = require("./File");

const ProfileFile = db.define('ProfileFiles', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    fileId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
});

ProfileFile.belongsTo(User, {foreignKey: 'userId'});
ProfileFile.belongsTo(File, {foreignKey: 'fileId'});

module.exports = ProfileFile;