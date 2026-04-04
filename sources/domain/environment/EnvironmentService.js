const Environment = require('../../model/dataModels/EnvironmentData');
const { Op } = require('sequelize');

class EnvironmentService {

    static async create(data) {
        return Environment.create(data);
    }

    static async getByUser(userId) {
        return await Environment.findAll({
            where: { userId },
            order: [['timestamp', 'DESC']]
        });
    }

    static async getByLocationAndTime({ lat, lon, from, to }) {
        return await Environment.findAll({
            where: {
                lat: {
                    [Op.between]: [lat - 0.01, lat + 0.01]
                },
                lon: {
                    [Op.between]: [lon - 0.01, lon + 0.01]
                },
                timestamp: {
                    [Op.between]: [new Date(from), new Date(to)]
                }
            }
        });
    }
}

module.exports = EnvironmentService;