// models/UserEnvironmentData.js
const { DataTypes } = require('sequelize');
const db = require('../../data/DBase');

const UserEnvironmentData = db.define('UserEnvironmentData', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },

    lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    lon: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    temperature: DataTypes.FLOAT,
    humidity: DataTypes.FLOAT,
    pressure: DataTypes.FLOAT,

    windSpeed: DataTypes.FLOAT,
    windDeg: DataTypes.FLOAT,

    aqi: DataTypes.INTEGER,
    pm2_5: DataTypes.FLOAT,
    pm10: DataTypes.FLOAT,
    no2: DataTypes.FLOAT,
    o3: DataTypes.FLOAT,
    co: DataTypes.FLOAT,
    so2: DataTypes.FLOAT,

}, {
    timestamps: true
});

module.exports = UserEnvironmentData;