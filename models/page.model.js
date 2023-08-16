const mongoose = require('mongoose');
const { toJSON } = require('./plugin');
const httpStatus = require('http-status');
const slugify = require('slugify');

const { Schema } = mongoose;

const pageSchema = new Schema(
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
    content: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

pageSchema.plugin(toJSON);

/**
 * slugifying the title before saving it.
 */
pageSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  this.slug += `-${Math.floor(1000 + Math.random() * 9000)}`;
  next();
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
