const httpStatus = require('http-status');
const { userService, tokenService, authService, emailService, walletService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

/**
 * signup the  user.
 * @param {Object} user -body
 * @returns {Promise<User>}
 */
const signup = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  await emailService.sendConfirmationEmail(user.username, user.email, user.confirmToken);
  return res.status(httpStatus.CREATED).json({ status: 'success', data: { user } });
});

/**
 * forget password.
 * @param {string} user -email
 * @returns {Promise<otp>}
 */
const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const token = await tokenService.generateResetToken(email);
  await emailService.sendResetEmail(email, token);
  return res.status(httpStatus.ACCEPTED).json({ status: 'success', data: {} });
});

/**
 * Login user with email and password
 * @param {Object} -body
 * @returns {Promise<token>}
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (user.status !== 'active') {
    throw new ApiError('account is not active');
  }
  const token = tokenService.generateToken(user._id);
  let wallet = await walletService.getWalletByFilter({ user: user._id });
  if (!wallet) {
    wallet = await walletService.createWallet({ user: user._id });
  }
  return res.status(httpStatus.ACCEPTED).json({ status: 'success', data: { user, token } });
});

/**
 * Reset current user password with email
 * @param{string} - token
 * @param {string} - password
 * @returns {Promise<token>}
 */
const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log('password===', password);
  await authService.resetPassword(token, password);
  return res.status(httpStatus.ACCEPTED).json({ status: 'success', data: {} });
});

/**
 * Reset current user password with email
 * @param{string} - token
 * @param {string} - password
 * @returns {Promise<token>}
 */
const resetPasswordTokenCheck = catchAsync(async (req, res) => {
  const { token } = req.params;
  const user = await tokenService.verifyResetToken(token);
  if (!user) {
    throw new ApiError('Invalid token', httpStatus.BAD_REQUEST);
  }
  return res.status(httpStatus.ACCEPTED).json({ status: 'success', data: {} });
});

/**
 * to confirm the email
 * @param {string} - token
 * @returns {Promise<User>}
 */
const confirmEmail = catchAsync(async (req, res) => {
  const { token } = req.params;
  const user = await tokenService.verifyToken(token);
  await userService.updateUserById(user._id, {
    confirmToken: null,
    status: 'active',
  });
  return res.status(httpStatus.ACCEPTED).json({ status: 'success', data: { user } });
});

module.exports = {
  signup,
  forgetPassword,
  login,
  resetPassword,
  confirmEmail,
  resetPasswordTokenCheck,
};
