/**
 * to catch the async errors
 * @param {function} fn - Function which is asnyc
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
