const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

// nested routes
exports.createFilterObject = (req, res, next) => {
  let filterObj;
  if (req.params.productId) filterObj = { product: req.params.productId };
  req.filterObj = filterObj;
  next();
};

exports.setProductAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.getAllReviews = factory.getAll(Review, '', 'reviews');

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
