const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Review = require('../../models/reviewModel');
const AppError = require('../appError');
const Product = require('../../models/productModel');
// ensures product exists

exports.createReviewValidator = [
  check('name').optional(),
  check('ratings')
    .notEmpty()
    .withMessage('ratings value required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings value must be between 1 to 5'),
  check('user').isMongoId().withMessage('Invalid user id format'),
  check('product')
    .isMongoId()
    .withMessage('Invalid product id format')
    .bail()

    .custom(async (val, { req }) => {
      // Ensure we get the correct productId from params if needed
      const productId = req.body.product || req.params.productId;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError(`No product with this id ${val}`);
      }

      // Check if the logged-in user has already created a review for this product
      const review = await Review.findOne({
        user: req.user._id,
        product: productId,
      });
      if (review) {
        throw new AppError('You already created a review for this product');
      }
    }),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .bail()

    .custom((val, { req }) =>
      // Check review ownership before update
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new AppError(`There is no review with id ${val}`, 400),
          );
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new AppError(`You do not have permission to perform this action`),
          );
        }
      }),
    ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .bail()

    .custom((val, { req }) => {
      // Check review ownership before delete
      if (req.user.role === 'user') {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new AppError(`There is no review with id ${val}`),
            );
          }

          const reviewUserId = review.user._id || review.user;

          if (reviewUserId.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new AppError('You do not have permission to perform this action'),
            );
          }

          return true;
        });
      }

      return true;
    }),

  validatorMiddleware,
];
