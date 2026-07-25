const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// check works for params and body
// this is a validator middleware to validate the params.id in order to catch error before it is sent to the database
exports.getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id'),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('category name required')
    .isLength({ min: 3 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long category name'),
  check('genders')
    .notEmpty()
    .withMessage('category genders required')
    .isArray()
    .withMessage('category genders must be array'),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id'),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id'),
  validatorMiddleware,
];
