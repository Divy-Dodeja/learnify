const mongoose = require('mongoose');
const { toJSON } = require('./plugin');

const { Schema } = mongoose;

const sectionSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'suspended'],
    },
    order: {
      type: Number,
      default: 0,
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
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

sectionSchema.virtual('lectures', {
  ref: 'Lecture',
  localField: '_id',
  foreignField: 'sectionId',
});

sectionSchema.plugin(toJSON);
sectionSchema.plugin(require('mongoose-paginate-v2'));

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
