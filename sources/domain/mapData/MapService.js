// const axios = require("axios");
//
// const API_KEY = process.env.IQAIR_API_KEY;
//
// const cache = new Map();
//
// function getCacheKey(lat, lon) {
//     return `${lat}_${lon}`;
// }
//
// async function getAQI(lat, lon) {
//     const key = getCacheKey(lat, lon);
//
//     if (cache.has(key)) {
//         return cache.get(key);
//     }
//
//     try {
//         const url = `http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${API_KEY}`;
//
//         const { data } = await axios.get(url);
//
//         const aqi = data.data.current.pollution.aqius;
//
//         cache.set(key, aqi);
//         setTimeout(() => cache.delete(key), 1800000);
//
//         return aqi;
//
//     } catch (err) {
//         console.error("AQI error:", err.response?.data || err.message);
//         return null;
//     }
// }
//
// function filterByBBox(locations, latMin, latMax, lonMin, lonMax) {
//     return locations.filter(l =>
//         l.lat >= latMin &&
//         l.lat <= latMax &&
//         l.lon >= lonMin &&
//         l.lon <= lonMax
//     );
// }
//
// function filterByZoom(locations, zoom) {
//     if (zoom < 8) {
//         return locations.filter(l => l.type === "city");
//     }
//
//     if (zoom < 11) {
//         return locations;
//     }
//
//     return locations;
// }
//
// function getDistance(lat1, lon1, lat2, lon2) {
//     return Math.sqrt(
//         (lat1 - lat2) ** 2 + (lon1 - lon2) ** 2
//     );
// }
//
// function findNearestLocation(lat, lon, locations) {
//     let nearest = null;
//     let minDist = Infinity;
//
//     for (const loc of locations) {
//         const dist = getDistance(lat, lon, loc.lat, loc.lon);
//
//         if (dist < minDist) {
//             minDist = dist;
//             nearest = loc;
//         }
//     }
//
//     return nearest;
// }
//
// module.exports = {
//     getAQI,
//     filterByBBox,
//     filterByZoom,
//     findNearestLocation
// };