const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createFilterObject = (req, res, next) => {
  let filterObj;
  if (req.params.categoryId) filterObj = { product: req.params.categoryId };
  req.filterObj = filterObj;
  next();
};

//  route:  GET api/v1/categories
//  access  public
exports.getAllCategories = factory.getAll(
  Category,
  'subcategories',
  'categories',
);

exports.getCategoriesByGender = catchAsync(async (req, res, next) => {
  const { gender } = req.params;

  const validGenders = ['men', 'women', 'kids'];
  if (!validGenders.includes(gender)) {
    return next(
      new AppError(
        `Invalid gender. Must be one of: ${validGenders.join(', ')}`,
        400,
      ),
    );
  }

  const data = await Category.aggregate([
    // 1. match only categories that include this gender
    { $match: { genders: gender } },

    // 2. lookup subcategories that belong to this category AND include this gender
    {
      $lookup: {
        from: 'subcategories',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$category', '$$categoryId'] },
                  { $in: [gender, '$genders'] },
                ],
              },
            },
          },
          { $project: { name: 1, slug: 1 } },
        ],
        as: 'subcategories',
      },
    },

    // 3. only return what the frontend needs
    { $project: { name: 1, slug: 1, subcategories: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    results: data.length,
    data,
  });
});

//  route:  POST api/v1/categories
//  access  admin
exports.createCategory = factory.createOne(Category);

//  route:  PATCH api/v1/categories/id
//  access  admin
exports.updateCategory = factory.updateOne(Category);

//  route:  GET api/v1/categories/id
//  access  public
exports.getCategory = factory.getOne(Category);

//  route:  DELETE api/v1/categories/id
//  access  admin
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const relatedProductsCount = await Product.countDocuments({
    category: id,
  });

  if (relatedProductsCount > 0) {
    return next(
      new AppError(
        'Cannot delete category because products are assigned to it',
        400,
      ),
    );
  }

  const category = await Category.findById(id);

  if (!category) {
    return next(new AppError(`No document with this ID ${id}`, 404));
  }

  await Category.deleteOne({ _id: id });

  res.status(204).send();
});
