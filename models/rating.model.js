const mongoose = require('mongoose');

const { Schema } = mongoose;

const ratingSchema = new Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      default: 5,
    },
    comment: {
      type: String,
    },
    response: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'spam'],
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
