const express = require('express');
const authControllers = require('../controllers/authControllers');

const {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  getCoupon,
  deleteCoupon,
} = require('../controllers/couponControllers');

const router = express.Router();

router.use(
  authControllers.protect,
  authControllers.restrictTo('admin', 'manager'),
);

router.route('/').get(getAllCoupons).post(createCoupon);

router.route('/:id').get(getCoupon).patch(updateCoupon).delete(deleteCoupon);

module.exports = router;
