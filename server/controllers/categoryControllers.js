const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const redis = require('../config/redis');
const slugify = require('slugify');

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

  const cacheKey = `menu:${gender}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    const data = cached;
    return res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    });
  }

  const data = await Category.aggregate([
    // 1. Match only categories that include this gender
    { $match: { genders: gender } },

    // 2. Lookup subcategories that belong to this category
    //    and include this gender
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

    // 3. Only return what the frontend needs
    {
      $project: {
        name: 1,
        slug: 1,
        subcategories: 1,
      },
    },
  ]);

  // Cache for 1 hour
  await redis.set(cacheKey, data, {
    ex: 3600,
  });

  res.status(200).json({
    status: 'success',
    results: data.length,
    data,
  });
});

const invalidateMenuCache = async (genders) => {
  if (!genders?.length) return;

  const keys = genders.map((gender) => `menu:${gender}`);

  await redis.del(...keys);
};

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

  const genders = category.genders;

  await Category.deleteOne({ _id: id });

  await invalidateMenuCache(genders);

  res.status(204).send();
});
``;
//  route:  POST api/v1/categories
//  access  admin
exports.createCategory = catchAsync(async (req, res, next) => {
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  const category = await Category.create(req.body);

  await invalidateMenuCache(category.genders);

  res.status(201).json({
    status: 'success',
    data: category,
  });
});

//  route:  PATCH api/v1/categories/id
//  access  admin
exports.updateCategory = catchAsync(async (req, res, next) => {
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError(`No document with this ID ${req.params.id}`, 404));
  }

  // Keep old genders because they may be removed by the update
  const oldGenders = category.genders;

  Object.assign(category, req.body);

  await category.save();

  // Invalidate both old and new genders
  const genders = [...new Set([...oldGenders, ...(category.genders || [])])];

  await invalidateMenuCache(genders);

  res.status(200).json({
    status: 'success',
    data: category,
  });
});
//  route:  GET api/v1/categories/id
//  access  public
exports.getCategory = factory.getOne(Category);
