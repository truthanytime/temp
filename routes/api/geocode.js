const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  apiKey: '', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);