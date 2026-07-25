const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');
const AppError = require('../appError');

exports.signupValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new AppError('E-mail already in use'));
        }
      }),
    ),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new AppError("Passwords don't match");
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required'),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImg').optional(),
  check('role').optional(),

  validatorMiddleware,
];

exports.loginValidator = [
  // check('email')
  //   .notEmpty()
  //   .withMessage('Please provide your email')
  //   .isEmail()
  //   .withMessage('Please provide a valid email'),
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validatorMiddleware,
];
