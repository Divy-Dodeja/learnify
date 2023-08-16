const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { tokenService } = require('../services');

/**
 * to verify the current user token
 * */
const TempAuth = async (req, res, next) => {
  console.log('str===');
  if (req.header('Authorization')) {
    const token = req.header('Authorization').replace('Bearer ', '');
    const user = await tokenService.verifyToken(token, true);
    if (user.status !== 'active') {
      return next(new ApiError('Account is Not Active!', httpStatus.UNAUTHORIZED));
    }
    req.token = token;
    req.user = user;
    next();
  } else {
    next();
  }
};

module.exports = TempAuth;
