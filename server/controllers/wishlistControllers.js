const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.addProductToWishlist = catchAsync(async (req, res, next) => {
  // $addToSet => add product to user's wishlist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.body.productId } },
    {
      new: true,
      runValidators: true,
    },
  ); //the $addToSet operator prevents duplicates

  res.status(200).json({
    status: 'success',
    message: 'Product added to wishlist',
    data: user.wishlist,
  });
});

exports.removeProductFromWishlist = catchAsync(async (req, res, next) => {
  // $pull => remove product from user's wishlist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.productId } },
    {
      new: true,
      runValidators: true,
    },
  ); //the $addToSet operator prevents duplicates

  res.status(200).json({
    status: 'success',
    message: 'Product removed from wishlist',
    data: user.wishlist,
  });
});

exports.getLoggedUserWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    status: 'success',
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
