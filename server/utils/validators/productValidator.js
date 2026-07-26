const mongoose = require('mongoose');
const slugify = require('slugify');
const { check, body, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category = require('../../models/categoryModel');
const Subcategory = require('../../models/subcategoryModel');
const Product = require('../../models/productModel');
const AppError = require('../appError');

const allowedSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

exports.createProductValidator = [
  check('name')
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 chars')
    .notEmpty()
    .withMessage('Product name is required'),

  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 2000 })
    .withMessage('Too long description'),

  check('gender')
    .notEmpty()
    .withMessage('Product gender is required')
    .isIn(['men', 'women', 'kids'])
    .withMessage('Gender must be one of: men, women, kids'),

  check('sold').optional().isNumeric().withMessage('Sold must be a number'),

  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number')
    .custom((val) => {
      if (val < 0) {
        throw new AppError('Product price must be greater than or equal to 0');
      }
      return true;
    }),

  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Product priceAfterDiscount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (Number(req.body.price) <= value) {
        throw new AppError('priceAfterDiscount must be lower than price');
      }
      return true;
    }),

  check('season').optional().isArray().withMessage('season must be an array'),

  check('variants')
    .notEmpty()
    .withMessage('Product variants are required')
    .isArray({ min: 1 })
    .withMessage('Product must have at least one variant'),

  body('variants.*.size')
    .optional()
    .customSanitizer((val) =>
      typeof val === 'string' ? val.toUpperCase() : val,
    )
    .isIn(allowedSizes)
    .withMessage('Invalid size'),

  body('variants.*.color.name')
    .notEmpty()
    .withMessage('Variant color name is required'),

  body('variants.*.color.hex')
    .notEmpty()
    .withMessage('Variant color hex is required'),

  body('variants.*.quantity')
    .notEmpty()
    .withMessage('Variant quantity is required')
    .isInt({ min: 0 })
    .withMessage('Variant quantity must be a non-negative integer'),

  body('variants').custom((variants) => {
    const combinations = variants.map(
      (variant) => `${variant.size}-${variant.color.name.toLowerCase().trim()}`,
    );

    if (new Set(combinations).size !== combinations.length) {
      throw new AppError('Duplicate size/color variant found');
    }

    return true;
  }),

  check('material').optional().isString(),

  check('careInstructions')
    .optional()
    .isArray()
    .withMessage('careInstructions must be an array'),

  check('fit')
    .optional()
    .isIn(['slim', 'regular', 'relaxed', 'oversized', 'skinny'])
    .withMessage('Invalid fit value'),

  check('category')
    .notEmpty()
    .withMessage('Product must belong to a category')
    .isMongoId()
    .withMessage('Invalid category ID format')
    .bail()
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new AppError(`No category for this id: ${categoryId}`),
          );
        }
      }),
    ),

  check('subcategory')
    .notEmpty()
    .withMessage('Product must belong to a subcategory')
    .isMongoId()
    .withMessage('Invalid subcategory id')
    .bail()

    .custom(async (subcategoryId) => {
      const subcategory = await Subcategory.findById(subcategoryId);

      if (!subcategory) {
        throw new AppError('Subcategory does not exist.');
      }

      return true;
    })

    .custom(async (subcategoryId, { req }) => {
      const subcategory = await Subcategory.findOne({
        _id: subcategoryId,
        category: req.body.category,
      });

      if (!subcategory) {
        throw new AppError("Subcategory doesn't belong to this category.");
      }

      return true;
    }),

  check('ratingsAverage')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('ratingsAverage must be between 1 and 5'),

  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity must be a number'),

  check('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be boolean'),

  check('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean'),

  check('tags').optional().isArray().withMessage('tags must be an array'),

  validatorMiddleware,
];

exports.getProductValidator = [
  check('id').isMongoId().withMessage('Invalid product ID format'),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid product ID format'),

  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID format')
    .bail()

    .custom(async (val, { req }) => {
      const category = await Category.findById(req.body.category);

      if (!category) {
        throw new AppError('No category for this id');
      }

      return true;
    }),

  body('variants')
    .optional()
    .isArray({ min: 1 })
    .withMessage('variants must be a non-empty array'),

  body('variants.*.size')
    .optional()
    .customSanitizer((val) =>
      typeof val === 'string' ? val.toUpperCase() : val,
    )
    .isIn(allowedSizes)
    .withMessage('Invalid size'),

  body('variants.*.quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Variant quantity must be a non-negative integer'),

  body('variants')
    .optional()
    .custom((variants) => {
      const combinations = variants.map(
        (variant) =>
          `${variant.size}-${variant.color.name.toLowerCase().trim()}`,
      );

      if (new Set(combinations).size !== combinations.length) {
        throw new AppError('Duplicate size/color variant found');
      }

      return true;
    }),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid product ID format'),
  validatorMiddleware,
];

exports.validateProductId = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID format')
    .bail()

    .custom(async (val) => {
      const product = await Product.findById(val);

      if (!product) {
        throw new AppError(`No product with this id ${val}`);
      }

      return true;
    }),

  validatorMiddleware,
];
