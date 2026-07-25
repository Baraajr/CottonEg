const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// check works for params and body
// this is a validator middleware to validate the params.id in order to catch error before it is sent to the database
exports.getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id'),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name required')
    .isLength({ min: 2 })
    .withMessage('Too short Brand name')
    .isLength({ max: 32 })
    .withMessage('Too long Brand name'),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id'),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id'),
  validatorMiddleware,
];
