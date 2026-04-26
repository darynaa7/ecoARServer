// controllers/environmentController.js
const { getEnvironmentData } = require('../environment/EnvironmentService');
const EnvironmentData = require('../../model/dataModels/EnvironmentData');
const UserEnvironmentData = require('../../model/dataModels/SavedEnvironmentData');


async function fetchByLocation(req, res) {
    try {
        const { lat, lon } = req.body;
        if (!lat || !lon) {
            return res.status(400).json({ message: 'lat and lon required' });
        }
        console.log(req.headers.authorization);

        const data = await getEnvironmentData(lat, lon);

        const saved = await EnvironmentData.create({
            lat,
            lon,
            ...data
        });

        res.json(saved);

    } catch (error) {
        console.error(error.message); // лог в консоль

        res.status(500).json({
            message: error.message || 'Server error'
        });
    }
}


async function fetchAndSaveForUser(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { lat, lon } = req.body;

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

        return res.json(saved);

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            message: 'error',
            error: e.message
        });
    }
}


async function getUserHistory(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { lat, lon, from, to } = req.query;

        const where = { userId };

        if (lat && lon) {
            where.lat = lat;
            where.lon = lon;
        }

        if (from && to) {
            where.createdAt = {
                [Op.between]: [new Date(from), new Date(to)]
            };
        }

        const data = await UserEnvironmentData.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        return res.json(data);

    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: 'error' });
    }
}

module.exports = {
    fetchByLocation,
    fetchAndSaveForUser,
    getUserHistory
};