const loadLocations = require("../mapData/LoadLocations");
const { filterByBBox, filterByZoom } = require("../mapData/MapService");

let locations = [];

(async () => {
    locations = await loadLocations();
    console.log("Locations loaded:", locations.length);
})();

async function getMapData(req, res) {
    try {
        const body = req.body || req.query;

        const lat_min = parseFloat(body.lat_min);
        const lat_max = parseFloat(body.lat_max);
        const lon_min = parseFloat(body.lon_min);
        const lon_max = parseFloat(body.lon_max);
        const zoom = parseInt(body.zoom || 10);

        if ([lat_min, lat_max, lon_min, lon_max].some(v => isNaN(v))) {
            return res.status(400).json({ message: "Invalid bbox" });
        }

        if (!locations.length) {
            return res.status(503).json({ message: "Data not loaded yet" });
        }

        let filtered = filterByBBox(locations, lat_min, lat_max, lon_min, lon_max);
        filtered = filterByZoom(filtered, zoom);

        return res.json(filtered.slice(0, 30));

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { getMapData };