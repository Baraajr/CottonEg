const Subcategory = require('../models/subcategoryModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const Category = require('../models/categoryModel');

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//  route:  GET api/v1/Subcategories
//  access  public
exports.getAllSubcategories = factory.getAll(Subcategory, '', 'subcategories');

//  route:  POST api/v1/Subcategories
//  access  admin
exports.createSubcategory = catchAsync(async (req, res, next) => {
  const { name, categoryId, genders } = req.body;

  if (!name) {
    return next(new AppError('Please provide subcategory name', 400));
  }

  if (!categoryId) {
    return next(new AppError('Please provide category id', 400));
  }

  if (!genders || !Array.isArray(genders) || genders?.length < 1) {
    return next(new AppError('Please provide subcategory genders', 400));
  }

  const category = await Category.findById(categoryId);

  if (!category) return next(new AppError("This category doesn't exist", 400));

  const subcategory = await Subcategory.create({
    name,
    category: categoryId,
    genders,
  });

  res.status(201).json({
    status: 'success',
    data: subcategory,
  });
});

//  route:  PATCH api/v1/Subcategories/id
//  access  admin
exports.updateSubcategory = factory.updateOne(Subcategory);

//  route:  GET api/v1/Subcategories/id  id = df21dsf2sd1fsdf5sdf1sdf5
//  access  public
exports.getSubcategory = factory.getOne(Subcategory);

//  route:  DELETE api/v1/Subcategories/id
//  access  admin
exports.deleteSubcategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const relatedProductsCount = await Product.countDocuments({
    subcategory: id,
  });

  if (relatedProductsCount > 0) {
    return next(
      new AppErr(
        'Cannot delete subcategory because products are assigned to it',
        400,
      ),
    );
  }

  const subcategory = await Subcategory.findById(id);

  if (!subcategory) {
    return next(new AppError(`No document with this ID ${id}`, 404));
  }

  await Subcategory.deleteOne({ _id: id });

  res.status(204).send();
});
