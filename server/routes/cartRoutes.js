const express = require('express');
const authControllers = require('../controllers/authControllers');

const {
  addProductToCart,
  getLoggedUserCart,
  removeProductFromCart,
  clearLoggedUserCart,
  updateCartItemQuantity,
  applyCoupon,
} = require('../controllers/cartControllers');

const router = express.Router();
router.use(authControllers.protect, authControllers.restrictTo('user'));

router.patch('/applyCoupon', applyCoupon);
router
  .route('/')
  .get(getLoggedUserCart)
  .post(addProductToCart)
  .delete(clearLoggedUserCart);
router
  .route('/:itemId')
  .patch(updateCartItemQuantity)
  .delete(removeProductFromCart);

module.exports = router;
