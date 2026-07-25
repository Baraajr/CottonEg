const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      unique: [true, ' subcategory name must be unique '],
      trim: true,
      minLength: [2, 'too short subcategory name'],
      maxLength: [32, 'too long subcategory name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Subcategory must belong to Category'],
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
  },
  {
    timestamps: true,
  },
);

subcategorySchema.pre('findOne', function (next) {
  if (this._mongooseOptions.lean) return next();
  this.populate({ path: 'category', select: 'name' });
  next();
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;
