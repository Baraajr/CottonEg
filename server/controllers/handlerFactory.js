const slugify = require('slugify');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const redis = require('../config/redis');

const invalidateCache = async (modelName) => {
  const keys = await redis.keys(`${modelName}:*`);

  if (keys.length) {
    await redis.del(...keys);
  }
};

exports.getAll = (model, populateOptions, modelName = '') =>
  catchAsync(async (req, res) => {
    const baseFilter = req.filterObj || {};

    modelName = modelName || model.modelName.toLowerCase();

    const shouldCache =
      modelName === 'products' ||
      (modelName === 'orders' && req.user?.role === 'admin');

    let cacheKey;

    if (shouldCache) {
      cacheKey = `${modelName}:${JSON.stringify(req.query)}`;

      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        return res.status(200).json({
          status: 'success',
          ...cachedData,
        });
      }
    }

    // 1) Build ONE reusable base query
    const baseQuery = model.find(baseFilter);

    const baseFeatures = new ApiFeatures(baseQuery, req.query)
      .filter()
      .search(modelName);

    const filteredQuery = baseFeatures.mongooseQuery;

    // 2) Get accurate count from same logic
    const countQuery = filteredQuery.clone();

    const filteredCount = await model
      .find(baseFilter)
      .merge(countQuery.getQuery())
      .countDocuments();

    // 3) Apply final query pipeline
    const features = new ApiFeatures(model.find(baseFilter), req.query)
      .filter()
      .search(modelName)
      .sort()
      .limitFields()
      .paginate(filteredCount);

    let query = features.mongooseQuery;

    // 4) Populate safely
    if (populateOptions) {
      query = query.populate({
        path: populateOptions,
        select: 'name',
      });
    }

    // 5) Execute
    const documents = await query;

    const responseData = {
      pageResults: documents.length,
      totalResults: filteredCount,
      paginationResult: features.paginationResult,
      data: documents,
    };

    // Cache for 5 minutes
    if (shouldCache) {
      await redis.set(cacheKey, responseData, {
        ex: 300,
      });
    }

    res.status(200).json({
      status: 'success',
      ...responseData,
    });
  });

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    // Case: nested route
    // api/v1/categories/categoryId/subcategories
    if (req.params.categoryId) {
      req.body.category = req.params.categoryId;
    }

    // Prevent anyone from signing up as admin
    delete req.body.role;

    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const newDoc = await model.create(req.body);

    await invalidateCache(model.modelName.toLowerCase());

    res.status(201).json({
      status: 'success',
      data: newDoc,
    });
  });

exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    // Use findOneAndDelete to trigger the post deleteOne middleware
    // to calculate average ratings after deleting a review
    const deletedDoc = await model.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedDoc) {
      return next(
        new AppError(`No document with this ID ${req.params.id}`, 404),
      );
    }

    await invalidateCache(model.modelName.toLowerCase());

    res.status(204).json({
      status: 'deleted',
      data: null,
    });
  });

exports.getOne = (model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id);

    if (populateOptions) {
      query = query.populate({
        path: populateOptions,
      });
    }

    const doc = await query;

    if (!doc) {
      return next(
        new AppError(`No document with this ID ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    // Case: updating title or name
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    const oldDoc = await model.findById(req.params.id);

    if (!oldDoc) {
      return next(
        new AppError(`No document with this ID ${req.params.id}`, 404),
      );
    }

    oldDoc.set(req.body);

    // To be able to use the post save middleware
    const updatedDoc = await oldDoc.save();

    await invalidateCache(model.modelName.toLowerCase());

    res.status(200).json({
      status: 'success',
      data: updatedDoc,
    });
  });
