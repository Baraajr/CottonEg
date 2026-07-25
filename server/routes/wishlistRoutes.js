const express = require('express');
const authControllers = require('../controllers/authControllers');
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require('../controllers/wishlistControllers');

const router = express.Router();

router.use(authControllers.protect, authControllers.restrictTo('user'));

router.route('/').get(getLoggedUserWishlist).post(addProductToWishlist);

router.delete('/:productId', removeProductFromWishlist);

module.exports = router;
