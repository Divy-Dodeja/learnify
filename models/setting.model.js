const mongoose = require('mongoose');
const { Schema } = mongoose;

const settingSchema = new Schema(
  {
    title: {
      type: String,
      default: 'Learnify',
    },
    description: {
      type: String,
      default: 'Explore best Learning Paths at your own time and place.',
    },
    adminPercentage: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
