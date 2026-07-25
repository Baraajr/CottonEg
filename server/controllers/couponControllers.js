const Coupon = require('../models/couponModel');
const factory = require('./handlerFactory');

exports.getAllCoupons = factory.getAll(Coupon, '', 'coupons');
exports.createCoupon = factory.createOne(Coupon);
exports.updateCoupon = factory.updateOne(Coupon);
exports.getCoupon = factory.getOne(Coupon);
exports.deleteCoupon = factory.deleteOne(Coupon);
