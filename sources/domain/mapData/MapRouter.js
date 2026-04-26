const Router = require("express");
const router = new Router();
const mapController = require('./MapController');

router.post('/air-quality', mapController.fetchAirQuality);

module.exports = router;