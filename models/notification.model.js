const mongoose = require('mongoose');
const { Schema } = mongoose;
const { toJSON } = require("./plugin");

const notificationSchema = new Schema(
  {
    title: {
      type: String,
    },
    nType: {
      type: String,
      enum: ['course', 'lecture', 'section', 'payment'],
      default: 'course',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
    lecture: {
      type: mongoose.Types.ObjectId,
      ref: 'Lecture',
    },
    section: {
      type: mongoose.Types.ObjectId,
      ref: 'Section',
    },
    transaction: {
      type: mongoose.Types.ObjectId,
      ref: 'Transaction',
    },
    reason: {
      type: String,
    },
    isForAdmin: {
      type: Boolean,
      default: false,
    },
    isForAll: {
      type: Boolean,
      default: false,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(require("mongoose-paginate-v2"));

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
