const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { tokenService } = require('../services');

/**
 * to verify the current user token
 * */
const Auth = async (req, res, next) => {
  if (req.header('Authorization')) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return next(new ApiError('Invalid Auth', httpStatus.UNAUTHORIZED));
    }
    const user = await tokenService.verifyToken(token, true);
    if(user.status !== "active"){
      return next(new ApiError('Account is Not Active!', httpStatus.UNAUTHORIZED));
    }
    req.token = token;
    req.user = user;
    next();
  } else {
    throw new ApiError('Token is required', httpStatus.BAD_REQUEST);
  }
};

module.exports = Auth;
