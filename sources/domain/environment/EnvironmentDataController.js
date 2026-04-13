// controllers/environmentController.js
const { getEnvironmentData } = require('../environment/EnvironmentService');
const EnvironmentData = require('../../model/dataModels/EnvironmentData');
const UserEnvironmentData = require('../../model/dataModels/EnvironmentData');


async function fetchByLocation(req, res) {
    try {
        const { lat, lon } = req.body;
        if (!lat || !lon) {
            return res.status(400).json({ message: 'lat and lon required' });
        }

        const data = await getEnvironmentData(lat, lon);

        const saved = await EnvironmentData.create({
            lat,
            lon,
            ...data
        });

        res.json(saved);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


async function fetchAndSaveForUser(req, res) {
    try {
        const { lat, lon } = req.body;

        const userId = req.user.id;

        if (!lat || !lon) {
            return res.status(400).json({ message: 'lat/lon required' });
        }

        const data = await getEnvironmentData(lat, lon);

        const saved = await UserEnvironmentData.create({
            userId,
            lat,
            lon,
            ...data
        });

        res.json(saved);

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'error' });
    }
}

async function getUserHistory(req, res) {
    try {
        const userId = req.user.id;

        const { lat, lon, from, to } = req.query;

        const where = { userId };

        if (lat && lon) {
            where.lat = lat;
            where.lon = lon;
        }

        if (from && to) {
            where.createdAt = {
                [require('sequelize').Op.between]: [new Date(from), new Date(to)]
            };
        }

        const data = await UserEnvironmentData.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        res.json(data);

    } catch (e) {
        res.status(500).json({ message: 'error' });
    }
}


module.exports = { fetchByLocation, fetchAndSaveForUser, getUserHistory };