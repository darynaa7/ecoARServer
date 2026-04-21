const fs = require("fs");
const csv = require("csv-parser");

function parseNumber(str) {
    if (!str) return null;
    const cleaned = String(str).replace(",", ".").replace(/[^\d.-]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

function normalizeCity(name) {
    if (!name) return null;
    return String(name).trim();
}

function loadLocations() {
    return new Promise((resolve, reject) => {
        const map = new Map();

        fs.createReadStream("sichen_2026.csv")
            .pipe(csv({ separator: ";" }))
            .on("data", (row) => {
                const city = normalizeCity(row.city || row["\uFEFFcity"]);
                if (!city) return;

                const aqi = parseNumber(row.airPollutionIndex);
                if (aqi === null) return;

                if (!map.has(city)) {
                    map.set(city, {
                        name: city,
                        aqi
                    });
                } else {
                    const existing = map.get(city);
                    existing.aqi = Math.max(existing.aqi, aqi);
                }
            })
            .on("end", () => {
                resolve([...map.values()]);
            })
            .on("error", reject);
    });
}

module.exports = loadLocations;