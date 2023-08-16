const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config/config');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Generate token
 * @param {ObjectId} userId
 * @returns {string}
 */
const generateToken = (
  userId,
  expires = config.jwt.resetPasswordExpirationMinutes * 60 * 1000,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
  };
  const token = jwt.sign(payload, secret, { expiresIn: expires });
  return token;
};

/**
 * Verify token if valid then return userObject
 * @param {String} token
 * @param {Boolean} isChanged
 * @return {Object}
 * */
const verifyToken = async (token, isChanged = false, secret = config.jwt.secret) => {
  const payload = jwt.verify(token, secret);
  const user = await User.findOne({ _id: payload.sub }).populate('wallet');
  if (!user) {
    throw new ApiError('Invalid token', httpStatus.UNAUTHORIZED);
  }
  if (isChanged && user.changedPasswordAfter(payload.iat)) {
    throw new ApiError('Invalid token', httpStatus.UNAUTHORIZED);
  }
  if (user.status === 'suspended') {
    throw new ApiError('you have been suspended', httpStatus.UNAUTHORIZED);
  }

  return user;
};

/**
 * Generate token for the reset Password
 * @param {email} email
 * @return {Promise<String>}
 * */
const generateResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError('No user Found with this email', httpStatus.BAD_REQUEST);
  }
  const expires = Date.now() + config.jwt.resetPasswordExpirationMinutes * 60 * 1000;
  const resetPasswordToken = generateToken(user.id, expires);
  user.resetToken = resetPasswordToken;
  user.resetTokenExpire = expires;
  await user.save();
  return resetPasswordToken;
};

/**
 * Verify Reset Token
 * @param {token} resetToken
 * @return {Promise<User>>}
 * */
const verifyResetToken = async (token, secret = config.jwt.secret) => {
  const payload = jwt.verify(token, secret);
  const user = await User.findOne({
    _id: payload.sub,
    resetToken: { $ne: null },
    resetTokenExpire: { $ne: null },
  }).populate('wallet');
  return user;
};

module.exports = {
  generateToken,
  verifyToken,
  generateResetToken,
  verifyResetToken,
};
