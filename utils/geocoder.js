const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
    provider: 'openstreetmap'  // free, no API key needed
});

module.exports = geocoder;