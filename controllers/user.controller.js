const httpStatus = require('http-status');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');

/**
 * to get the current user profile
 */
const getCurrentUserProfile = catchAsync((req, res) => {
  const { user } = req;
  return res.status(httpStatus.ACCEPTED).json({ status: 'success', data: { user } });
});

/**
 * to update the current user profile
 */
const updateCurrentUserProfile = catchAsync(async (req, res) => {
  let { user } = req;
  user = await userService.updateUserById(user._id, req.body);
  return res.status(httpStatus.ACCEPTED).json({ status: 'success', data: { user } });
});

/**
 * to update the current user password
 */
const changeCurrentUserPassword = catchAsync(async (req, res) => {
  const { password, newPassword } = req.body;
  const { user } = req;
  const isValid = await user.isPasswordMatch(password);
  if (!isValid) {
    throw new ApiError('Old password does not match!', httpStatus.BAD_REQUEST);
  }
  const newUser = await userService.updateUserById(user._id, {
    password: newPassword,
    passwordChangedAt: Date.now(),
  });
  return res.status(httpStatus.OK).json({ status: 'success', data: { user: newUser } });
});

/**
 * to get all the users
 */
const getAllUsers = catchAsync(async (req, res) => {
  const { query } = req;
  const options = _.pick(query, ['isAdmin', 'isAuthor']);
  const users = await userService.getUsers(options);
  return res.status(httpStatus.OK).json({ status: 'success', data: { users } });
});

/**
 * to get user by its id
 */
const getUserByItsId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  if (!user) {
    throw new ApiError('no user found with this id', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.OK).json({ status: 'success', data: { user } });
});

/**
 * to suspend the user
 */
const suspendUserByItsId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await userService.updateUserById(id, { status: 'suspended' });
  return res.status(httpStatus.OK).json({ status: 'success', data: { user } });
});

/**
 * to activate the user
 */
const activeUserByItsId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await userService.updateUserById(id, { status: 'active' });
  return res.status(httpStatus.OK).json({ status: 'success', data: { user } });
});

/**
 * to update the user by its id
 */
const updateUserByItsId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await userService.updateUserById(id, req.body);
  return res.status(httpStatus.OK).json({ status: 'success', data: { user } });
});

const upgradeToInstructor = catchAsync(async (req, res) => {
  const { user } = req;
  // TODO: deploy the changes
  if (user.isAuthor === true) {
    throw new ApiError('you are already instructor', httpStatus.BAD_REQUEST);
  }
  user.isAuthor = true;
  await user.save();
  return res.status(httpStatus.OK).json({ status: 'success', data: { user } });
});

module.exports = {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  changeCurrentUserPassword,
  getAllUsers,
  getUserByItsId,
  suspendUserByItsId,
  activeUserByItsId,
  updateUserByItsId,
  upgradeToInstructor,
};
