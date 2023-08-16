const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const { toJSON } = require('./plugin');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      private: true,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },
    image: {
      type: String,
      default: 'avatar.jpg',
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['active', 'pending', 'suspended'],
    },
    resetToken: {
      type: String,
      private: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAuthor: {
      type: Boolean,
      default: false,
    },
    isUser: {
      type: Boolean,
      default: true,
    },
    resetTokenExpire: {
      type: Date,
      private: true,
    },
    confirmToken: {
      type: String,
      private: true,
    },
    defaultBankAccount: {
      type: mongoose.Types.ObjectId,
      ref: 'BankMethod',
    },
  },
  { timestamps: true, toJSON: { virtual: true }, toObject: { virtual: true } }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

/**
 * Hashing the password before saving
 * */
userSchema.pre('save', async function (next) {
  console.log('check-===123123');
  if (!this.isModified('password')) {
    return next();
  }
  console.log('check-===');
  this.password = await bcryptjs.hash(this.password, 8);
  return next();
});

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcryptjs.compare(password, user.password);
};

/**
 * check if password is changed after token is generated
 * @param {Number} JWTTimestamp
 * @returns {Promise<boolean>}
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
