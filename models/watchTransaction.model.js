const mongoose = require('mongoose');

const { Schema } = mongoose;

const watchTransactionSchema = new Schema(
  {
    lectureId: {
      type: mongoose.Types.ObjectId,
      ref: 'Lecture',
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: Number,
      default: 0, // 0 = pending to watch and 1 means lecture watched
    },
  },
  {
    timestamps: true,
  }
);

const WatchTransaction = mongoose.model('WatchTransaction', watchTransactionSchema);

module.exports = WatchTransaction;
