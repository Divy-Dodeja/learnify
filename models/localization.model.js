const mongoose = require('mongoose');
const { toJSON } = require('./plugin');

const { Schema } = mongoose;

const localizationSchema = new Schema(
  {
    languageName: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

localizationSchema.plugin(toJSON);

const Localization = mongoose.model('Localization', localizationSchema);

module.exports = Localization;
