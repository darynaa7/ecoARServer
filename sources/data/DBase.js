const express = require('express');
const {Sequelize} = require('sequelize');
const authRouter = require('../domain/authentification/AuthRouter')
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: console.log
});

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//         dialect: 'postgres',
//         dialectOptions: {
//             ssl: false,
//         },
//         logging: console.log
//     }
// );

sequelize.authenticate().then(() => {
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
