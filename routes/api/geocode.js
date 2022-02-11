const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);