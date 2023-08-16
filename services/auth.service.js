const httpStatus = require('http-status');
const { User } = require('../models');
const { userService, tokenService } = require('./index');
const ApiError = require('../utils/ApiError');

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError('Credential Details are invalid', httpStatus.BAD_REQUEST);
  }
  if (user.status === 'suspended') {
    throw new ApiError('Your account has been suspended!', httpStatus.BAD_REQUEST);
  }
  return user;
};

/**
 * Reset password
 * @param {string} token
 * @param {string} new password
 * @returns {Promise}
 */
const resetPassword = async (token, newPassword) => {
  const user = await tokenService.verifyResetToken(token);
  if (!user) {
    throw new ApiError('No user found with this token', httpStatus.BAD_REQUEST);
  }
  user.password = newPassword;
  user.resetTokenExpire = null;
  user.resetToken = null;
  const usr = await user.save();
  console.log('user===', usr);
  return usr;
  // await User.findOneAndUpdate(
  //   { _id: user._id },
  //   {
  //     password: newPassword,
  //     resetTokenExpire: null,
  //     resetToken: null,
  //   }
  // );
};

module.exports = {
  loginUserWithEmailAndPassword,
  resetPassword,
};
