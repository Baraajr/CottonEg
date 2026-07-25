const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// check works for params and body
// this is a validator middleware to validate the params.id in order to catch error before it is sent to the database
exports.getSubcategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subcategory id'),
  validatorMiddleware,
];

exports.updateSubcategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subcategory id'),
  validatorMiddleware,
];

exports.deleteSubcategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subcategory id'),
  validatorMiddleware,
];
