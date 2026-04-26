const { getAirQuality } = require("../mapData/MapService");

class MapController {

    async fetchAirQuality(req, res) {
        try {
            const { lat, lon } = req.body;

            if (!lat || !lon) {
                return res.status(400).json({
                    message: 'lat and lon required'
                });
            }

            const data = await getAirQuality(lat, lon);

            const result = {
                location: {
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    coordinates: {
                        lat: data.location.coordinates[1],
                        lon: data.location.coordinates[0]
                    }
                },
                pollution: {
                    aqi: data.current.pollution.aqius,
                    main: data.current.pollution.mainus
                },
                weather: {
                    temperature: data.current.weather.tp,
                    humidity: data.current.weather.hu,
                    windSpeed: data.current.weather.ws
                }
            };

            return res.json(result);

        } catch (error) {
            console.error('IQAir error:', error.response?.data || error.message);

            return res.status(500).json({
                message: 'Failed to fetch air quality',
                error: error.response?.data || error.message
            });
        }
    }
}

module.exports = new MapController();