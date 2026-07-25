const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: true,
        },

        variant: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },

          color: {
            type: String,
            required: true,
          },

          size: {
            type: String,
            required: true,
          },

          sku: String,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],

    totalCartPrice: {
      type: Number,
      default: 0,
    },

    totalPriceAfterDiscount: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'cartItems.product',
    select: 'name price imageCover category',
    populate: {
      path: 'category',
      select: 'name',
    },
  });

  next();
});

module.exports = mongoose.model('Cart', cartSchema);
