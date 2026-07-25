const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      enum: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      required: true,
    },
    color: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      hex: {
        type: String,
        required: true,
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
    },
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: [true, 'Product name must be unique'],
      minlength: [3, 'Too short Product name'],
      maxlength: [60, 'Too long product name'],
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, 'A product must have a description'],
      minlength: [10, 'Too short product description'],
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: [true, 'A product must have a price'],
      min: [0, 'Price must be greater than or equal to 0'],
    },

    priceAfterDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value == null || value < this.price;
        },
        message: 'Discount price must be lower than original price',
      },
    },

    season: [
      {
        type: String,
        enum: ['spring', 'summer', 'autumn', 'winter', 'all-season'],
      },
    ],

    variants: {
      type: [variantSchema],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'Product must have at least one variant',
      },
    },

    material: {
      type: String,
      trim: true,
    },

    careInstructions: [String],

    fit: {
      type: String,
      enum: ['slim', 'regular', 'relaxed', 'oversized', 'skinny'],
    },

    images: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: new mongoose.Types.ObjectId(),
        },
        url: String,
      },
    ],

    imageCover: {
      type: String,
      required: [true, 'Product cover image is required'],
    },

    gender: {
      type: String,
      enum: ['men', 'women', 'kids'],
      required: true,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },

    subcategory: {
      type: mongoose.Schema.ObjectId,
      ref: 'Subcategory',
      required: [true, 'Product must belong to a subcategory'],
    },

    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be equal or above 1'],
      max: [5, 'Rating must be equal or below 5'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Prevent duplicate size/color combinations
productSchema.pre('save', function (next) {
  const seen = new Set();

  const hasDuplicate = this.variants.some((v) => {
    const key = `${v.size}-${v.color.name.toLowerCase()}`;

    if (seen.has(key)) return true;

    seen.add(key);
    return false;
  });

  if (hasDuplicate) {
    return next(new AppError('Duplicate size/color variant found', 400));
  }

  next();
});

// Total inventory
productSchema.virtual('quantity').get(function () {
  return (this.variants ?? []).reduce(
    (total, variant) => total + (variant?.quantity || 0),
    0,
  );
});

// Populate category
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name',
  }).populate({
    path: 'subcategory',
    select: 'name',
  });

  next();
});

// Virtual populate reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
