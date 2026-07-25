const { Schema, default: mongoose } = require('mongoose');

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: [true, 'Category must be unique'],
      minLength: [3, 'Too short category name'],
      maxLength: [32, 'Too long category name'],
    },
    genders: {
      type: [
        {
          type: String,
          enum: ['men', 'women', 'kids'],
          set: (v) => v.toLowerCase(), // normalize before validation
        },
      ],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one gender must be selected',
      },
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }, // timestamps creates two fields created at and updated at
);

categorySchema.virtual('subcategories', {
  ref: 'Subcategory',
  foreignField: 'category',
  localField: '_id',
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
