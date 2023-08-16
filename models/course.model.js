const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const httpStatus = require('http-status');
const slugify = require('slugify');
const { toJSON } = require('./plugin');
const ApiError = require('../utils/ApiError');
const User = require('./user.model');

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: {
      type: String,
    },
    slug: {
      type: String,
    },
    dlong: {
      type: String,
    },
    dshort: {
      type: String,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
    },
    instructors: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'in-review', 'approved', 'draft', 'rejected', 'published'],
      default: 'pending',
    },
    rejectReason: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
    keywords: {
      type: String,
    },
    primaryInstructor: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    localizations: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Localization',
      },
    ],
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    learnDescriptionPoints: {
      type: String,
    },
    requirments: {
      type: String,
    },
    longDescription: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    introVideo: {
      type: String,
    },
    totalHours: {
      type: Number,
      default: 1,
    },
    totalArticles: {
      type: Number,
      default: 0,
    },
    resources: {
      type: Number,
      default: 0,
    },
    exercise: {
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
      transform: (doc, ret) => {
        if (ret.enrollments) {
          ret.enrollments = ret.enrollments.length + 1;
        }
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// add plugin that converts mongoose to json
courseSchema.plugin(toJSON);
courseSchema.plugin(mongoosePaginate);

courseSchema.virtual('sections', {
  ref: 'Section',
  localField: '_id',
  foreignField: 'courseId',
});

courseSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'course',
});

courseSchema.virtual('enrollments', {
  ref: 'EnrollTransaction',
  localField: '_id',
  foreignField: 'courseId',
});

/**
 * checking before creating the course like if instrctor is valid or not
 */
courseSchema.pre('save', async function (next) {
  const course = this;
  const user = await User.findOne({
    _id: course.primaryInstructor,

    $or: [{ isAuthor: true }, { isAdmin: true }],
  });
  if (!user) {
    throw new ApiError('user is not Instructor', httpStatus.BAD_REQUEST);
  }
  if (course.instructors.length !== 0) {
    const allInstrcutors = course.instructors.map((inst) => inst);
    const instructors = await User.find({
      _id: { $in: allInstrcutors },
      isAuthor: true,
    });
    if (instructors.length !== allInstrcutors.length) {
      throw new ApiError('some of user is not instructor', httpStatus.BAD_REQUEST);
    }
  }

  next();
});

/**
 * slugifying the title before saving it.
 */
courseSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  this.slug += `-${Math.floor(1000 + Math.random() * 9000)}`;
  next();
});

/**
 * soft delete
 */
courseSchema.methods.delete = async function () {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  await this.save();
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
