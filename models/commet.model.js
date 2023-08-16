const mongoose = require('mongoose');

const { Schema } = mongoose;
const { toJSON } = require('./plugin');

const commentSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
    lectureId: {
      type: mongoose.Types.ObjectId,
      ref: 'Lecture',
    },
    isReplied: {
      type: Boolean,
      default: false,
    },
    repliedTo: {
      type: mongoose.Types.ObjectId,
      ref: 'Comment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.plugin(toJSON);
commentSchema.plugin(require('mongoose-paginate-v2'));

/**
 * soft delete
 */
commentSchema.methods.delete = async function () {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  await this.save();
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
