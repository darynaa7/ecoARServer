// services/openWeatherService.js
const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;

async function getEnvironmentData(lat, lon) {
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        const airUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        const [weatherRes, airRes] = await Promise.all([
            axios.get(weatherUrl),
            axios.get(airUrl)
        ]);

        const weather = weatherRes.data;
        const air = airRes.data.list[0];

        return {
            temperature: weather.main.temp,
            humidity: weather.main.humidity,
            pressure: weather.main.pressure,

            windSpeed: weather.wind.speed,
            windDeg: weather.wind.deg,

            aqi: air.main.aqi,
            pm2_5: air.components.pm2_5,
            pm10: air.components.pm10,
            no2: air.components.no2,
            o3: air.components.o3,
            co: air.components.co,
            so2: air.components.so2,
        };

    } catch (error) {
        console.error('OpenWeather error:', error.message);
        throw error;
    }
}

module.exports = { getEnvironmentData };