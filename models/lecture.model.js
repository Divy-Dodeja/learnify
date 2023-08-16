const mongoose = require('mongoose');
const { toJSON } = require('./plugin');

const { Schema } = mongoose;

const resourceSchema = new Schema(
  {
    name: {
      type: String,
    },
    size: {
      type: String,
    },
    rtype: {
      type: String,
      enum: ['file', 'link'],
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

const lectureSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    lecutreType: {
      type: String,
      enum: ['video', 'document', 'youtube', 'youtubedocument'],
      default: 'video',
    },
    source: [
      {
        url: {
          type: String,
        },
        resolution: {
          type: String,
        },
      },
    ],
    preview: {
      type: Boolean,
      default: false,
    },
    documentContent: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'published', 'draft', 'rejected'],
      default: 'published',
    },
    rejectedReason: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
    sectionId: {
      type: mongoose.Types.ObjectId,
      ref: 'Section',
    },
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    duration: {
      type: Number,
    },
    deletedAt: {
      type: Date,
    },
    resources: [resourceSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        if (ret.isWatched) {
          return { ...ret, isWatched: true };
        } else {
          return { ...ret };
        }
      },
    },
  }
);

lectureSchema.plugin(toJSON);
lectureSchema.plugin(require('mongoose-paginate-v2'));

lectureSchema.virtual('isWatched', {
  ref: 'WatchTransaction',
  localField: '_id',
  foreignField: 'lectureId',
  justOne: true,
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;
