const multer = require('multer');
const slugify = require('slugify');
const Product = require('../models/productModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/imageUpload');
const AppError = require('../utils/appError');
const { default: mongoose } = require('mongoose');
const redis = require('../config/redis');

const invalidateProductsCache = async () => {
  const keys = await redis.keys('products:*');

  if (keys.length) {
    await redis.del(...keys);
  }
};

const multerStorage = multer.memoryStorage();

const upload = multer({ storage: multerStorage });

exports.uploadProductImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
  { name: 'addImage', maxCount: 5 },
]);

exports.processProductImages = catchAsync(async (req, res, next) => {
  if (req.validationError) return next();
  if (!req.files) return next();

  const uploadFolder = 'products';
  const timestamp = Date.now();

  // Upload imageCover
  if (req.files.imageCover?.[0]) {
    const file = req.files.imageCover[0];

    const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
      'base64',
    )}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: uploadFolder,
      public_id: `product-${timestamp}-cover`,
      format: 'jpg',
    });

    req.body.imageCover = result.secure_url;
  }

  // Upload images[] (replace all images)
  if (req.files.images?.length) {
    const uploadedImages = await Promise.all(
      req.files.images.map(async (file, i) => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
          'base64',
        )}`;

        const result = await cloudinary.uploader.upload(base64, {
          folder: uploadFolder,
          public_id: `product-${timestamp}-img-${i}`,
          format: 'jpg',
        });

        return {
          _id: new mongoose.Types.ObjectId(),
          url: result.secure_url,
        };
      }),
    );

    req.body.images = uploadedImages;
  }

  // Upload single addImage (append one image)
  if (req.files.addImage?.[0]) {
    const file = req.files.addImage[0];

    const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
      'base64',
    )}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: uploadFolder,
      public_id: `product-${timestamp}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      format: 'jpg',
    });

    req.body.addImage = result.secure_url;
  }

  next();
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError(`No document with this ID ${req.params.id}`, 404));
  }

  const parse = (value) => {
    if (value === undefined) return value;

    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    return value;
  };

  const allowedFields = [
    'name',
    'description',
    'price',
    'priceAfterDiscount',
    'season',
    'material',
    'fit',
    'featured',
    'isActive',
    'tags',
    'category',
    'subcategory',
    'imageCover',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = parse(req.body[field]);
    }
  });

  await product.save();

  await invalidateProductsCache();

  res.status(200).json({
    status: 'success',
    data: product,
  });
});

exports.addVariant = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const variant = req.body;

  const exists = product.variants.some(
    (v) =>
      v.size === variant.size &&
      v.color.name.toLowerCase() === variant.color.name.toLowerCase(),
  );

  if (exists) {
    return next(
      new AppError('Variant with same size and color already exists', 400),
    );
  }

  product.variants.push(variant);

  await product.save();

  await invalidateProductsCache();

  res.status(201).json({
    status: 'success',
    data: {
      variant: product.variants.at(-1),
    },
  });
});

exports.editVariant = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const variant = product.variants.id(req.params.variantId);

  if (!variant) {
    return next(new AppError('Variant not found', 404));
  }

  Object.keys(req.body).forEach((key) => {
    variant[key] = req.body[key];
  });

  await product.save();

  await invalidateProductsCache();

  res.status(200).json({
    status: 'success',
    data: {
      variant,
    },
  });
});

exports.deleteVariant = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (product.variants.length === 1) {
    return next(new AppError('Product must have at least one variant', 400));
  }

  product.variants = product.variants.filter(
    (v) => v._id.toString() !== req.params.variantId,
  );

  await product.save();

  await invalidateProductsCache();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.addImage = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (!req.body.addImage) {
    return next(new AppError('Image url is required', 400));
  }

  product.images.push({
    url: req.body.addImage,
  });

  await product.save();

  await invalidateProductsCache();

  res.status(201).json({
    status: 'success',
    data: {
      image: product.images.at(-1),
    },
  });
});

exports.deleteImage = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  product.images = product.images.filter(
    (img) => img._id.toString() !== req.params.imageId,
  );

  await product.save();

  await invalidateProductsCache();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.setBodySlug = (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);

  next();
};

exports.parseVariants = (req, res, next) => {
  if (req.body.variants && typeof req.body.variants === 'string') {
    try {
      req.body.variants = JSON.parse(req.body.variants);
    } catch {
      return next(new AppError('Invalid variants format', 400));
    }
  }

  next();
};

exports.getAllProducts = factory.getAll(Product, '', 'products');

exports.createProduct = factory.createOne(Product);

exports.getProduct = factory.getOne(Product, 'reviews');

exports.deleteProduct = factory.deleteOne(Product);

exports.search = catchAsync(async (req, res, next) => {
  const { text } = req.body;

  if (!text) {
    return next(new AppError('Search text is required', 400));
  }

  const query = {
    $or: [
      { name: { $regex: text, $options: 'i' } },
      { description: { $regex: text, $options: 'i' } },
    ],
  };

  const products = await Product.find(query);

  res.status(200).json({
    status: 'success',
    data: products,
  });
});
