const mongoose = require('mongoose');
const { toJSON } = require('./plugin');

const { Schema } = mongoose;

const enrollTransactionSchema = new Schema(
  {
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: 'Order',
    },
    progress: [
      {
        lecture: {
          type: mongoose.Types.ObjectId,
          ref: 'Lecture',
        },
        status: {
          type: String,
          enum: ['completed'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

enrollTransactionSchema.plugin(toJSON);
enrollTransactionSchema.plugin(require('mongoose-paginate-v2'));

const EnrollTransaction = mongoose.model('EnrollTransaction', enrollTransactionSchema);

module.exports = EnrollTransaction;
