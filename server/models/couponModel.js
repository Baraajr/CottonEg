const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, 'Coupon name is required'],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, 'Expire date is required'],
    },
    discount: {
      type: Number,
      required: [true, 'Discount is required'],
    },
  },
  {
    timestamps: true,
  },
);

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
