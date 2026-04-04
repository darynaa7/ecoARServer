const EnvironmentService = require('./EnvironmentService');

class EnvironmentController {

    static async create(req, res) {
        try {
            const data = await EnvironmentService.create(req.body);
            res.status(201).json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async getByUser(req, res) {
        try {
            const data = await EnvironmentService.getByUser(req.params.userId);
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async getByLocation(req, res) {
        try {
            const data = await EnvironmentService.getByLocationAndTime(req.query);
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

module.exports = EnvironmentController;