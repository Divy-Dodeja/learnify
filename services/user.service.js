const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const tokenService = require('./token.service');

/**
 * Create User
 * @param {Object} body - request body
 * @returns {Object<User>}
 */
const createUser = async (body) => {
  if (await User.isEmailTaken(body.email)) {
    throw new ApiError('Email is Already Taken', httpStatus.BAD_REQUEST);
  }
  if (await User.isUsernameTaken(body.username)) {
    throw new ApiError('Username is Already Taken', httpStatus.BAD_REQUEST);
  }
  let user = await User.create(body);
  const token = tokenService.generateToken(user._id);
  console.log('token====', token);
  // eslint-disable-next-line no-use-before-define
  user = await updateUserById(user._id, { confirmToken: token });
  io.emit('user_created', 'user');
  return user;
};

/**
 * Get User by Id
 * @param {id} userId
 * @returns {Promise<User>>}
 */
const getUserById = async (id) => {
  return User.findOne({ _id: id });
};

/**
 * Get users
 * @returns {Promise<User>}
 */
const getUsers = async (filters = {}) => {
  return User.find(filters);
};

/**
 * Get User by Email
 * @param {email} User email
 * @returns {Promise<User>>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by its id
 * @param {id} User id
 * @param {Object} update body
 * @returns {Promise<User>>}
 */
const updateUserById = async (id, body) => {
  const user = await getUserById(id);

  if (!user) {
    throw new ApiError('no user found with this id', httpStatus.BAD_REQUEST);
  }
  if (body.email && (await User.isEmailTaken(body.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (body.username && (await User.isUsernameTaken(body.username, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }

  Object.assign(user, { ...body });
  const newUser = await user.save();
  return newUser;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  getUsers,
};
