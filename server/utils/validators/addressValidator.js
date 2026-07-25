const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');
const AppError = require('../appError');

exports.addAddressValidator = [
  check('alias')
    .notEmpty()
    .withMessage('alias required')
    .custom((val, { req }) =>
      User.findById(req.user._id).then((user) => {
        const hasAlias = user.addresses.some(
          (address) => address.alias === val,
        );
        if (hasAlias) {
          return Promise.reject(
            new AppError(`The address ${val} already exists`),
          );
        }
      }),
    ),
  check('phone')
    .notEmpty()
    .withMessage('Please provide your address phone')
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  check('postalCode')
    .notEmpty()
    .withMessage('Please provide your postal code')
    .isPostalCode('any')
    .withMessage('Please provide a valid postal code'),
  check('city').notEmpty().withMessage('please provide the city'),
  validatorMiddleware,
];
