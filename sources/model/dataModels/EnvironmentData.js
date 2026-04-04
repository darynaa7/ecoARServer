const { DataTypes } = require('sequelize');
const db = require('../../data/DBase');
const User = require('./User');

const Environment = db.define('Environment', {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    lat: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },

    lon: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },

    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    // AIR
    aqi: DataTypes.INTEGER,
    pm25: DataTypes.FLOAT,
    pm10: DataTypes.FLOAT,
    no2: DataTypes.FLOAT,
    o3: DataTypes.FLOAT,
    co: DataTypes.FLOAT,
    so2: DataTypes.FLOAT,

    // 🌦 WEATHER
    temperature: DataTypes.FLOAT,
    humidity: DataTypes.FLOAT,
    pressure: DataTypes.FLOAT,
    windSpeed: DataTypes.FLOAT,
    windDirection: DataTypes.FLOAT,

    //ENVIRONMENT
    ndvi: DataTypes.FLOAT,
    landSurfaceTemp: DataTypes.FLOAT,
    fireIndex: DataTypes.FLOAT,
    soilPollution: DataTypes.FLOAT,

    //WATER
    ph: DataTypes.FLOAT,
    waterPollution: DataTypes.FLOAT,

}, {
    tableName: 'EnvironmentData',
    timestamps: true,
});


Environment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Environment, { foreignKey: 'userId' });

module.exports = Environment;