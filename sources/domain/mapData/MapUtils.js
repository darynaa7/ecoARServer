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
//         return locations.filter(l => l.type !== "village");
//     }
//
//     return locations;
// }
//
// module.exports = {
//     filterByBBox,
//     filterByZoom
// };