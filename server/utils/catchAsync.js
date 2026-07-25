const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next); // Properly handle errors
};

module.exports = catchAsync;
