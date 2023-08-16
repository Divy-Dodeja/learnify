const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

module.exports = {
  isUser: catchAsync(async (req, res, next) => {
    const { user } = req;
    if (!user.isUser) {
      throw new ApiError('you does not have permission to access this route.', httpStatus.UNAUTHORIZED);
    }
    next();
  }),

  isAdmin: catchAsync(async (req, res, next) => {
    const { user } = req;
    if (!user.isAdmin) {
      throw new ApiError('you does not have permission to access this route.', httpStatus.UNAUTHORIZED);
    }
    next();
  }),

  isAuthor: catchAsync(async (req, res, next) => {
    const { user } = req;
    if (!user.isAuthor) {
      throw new ApiError('you does not have permission to access this route.', httpStatus.UNAUTHORIZED);
    }
    next();
  }),
};
