const axios = require('axios');

const API_KEY = process.env.IQAIR_API_KEY;

async function getAirQuality(lat, lon) {
    const response = await axios.get(
        'http://api.airvisual.com/v2/nearest_city',
        {
            params: {
                lat,
                lon,
                key: API_KEY
            }
        }
    );

    return response.data.data;
}

module.exports = {
    getAirQuality
};