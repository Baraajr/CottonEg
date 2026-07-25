const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.addAddress = catchAsync(async (req, res, next) => {
  // $addToSet => add Address object to user's wishlist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    {
      new: true,
      runValidators: true,
    },
  ); //the $addToSet operator prevents duplicates

  res.status(200).json({
    status: 'success',
    message: 'Address added successfully',
    data: { address: user.addresses },
  });
});

exports.removeAddress = catchAsync(async (req, res, next) => {
  // $pull => remove address from user's addresses
  await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.addressId } } }, // address here is an object not like product ObjectId in wishlist
    {
      new: true,
      runValidators: true,
    },
  ); //the $addToSet operator prevents duplicates

  res.status(204).json({
    status: 'success',
    message: 'address removed successfully ',
  });
});

exports.getLoggedUserAddresses = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('addresses');

  res.status(200).json({
    status: 'success',
    result: user.addresses.length,
    data: { addresses: user.addresses },
  });
});
