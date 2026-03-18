const { DataTypes } = require('sequelize');
const db = require('../../data/DBase');

const User = db.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        defaultValue: "MALE",
        allowNull: false,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tokenExpiration: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
}, {
    timestamps: false,
});

module.exports = User;
