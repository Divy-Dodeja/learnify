const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const slugify = require('slugify');
const { toJSON } = require('./plugin');

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    title: {
      type: String,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    isSubCategory: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    parentCategory: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
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
// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(mongoosePaginate);

/**
 * soft delete
 */
categorySchema.methods.delete = async function () {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  await this.save();
};

/**
 * slugifying the title before saving it.
 */
categorySchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  this.slug += `-${Math.floor(1000 + Math.random() * 9000)}`;
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
