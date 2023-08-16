const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.connect(config.mongoose.url, config.mongoose.options, (err) => {
  if (err) {
    // eslint-disable-next-line
    console.log(`Mongoose Connection Error : ${err}`);
  }
  // eslint-disable-next-line
  console.log('db connected!');
});
