const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');

/* =========================
   CALCULATE TOTAL PRICE
========================= */
const calculateTotalPrice = (cart) => {
  let total = 0;

  cart.cartItems.forEach((item) => {
    const price = item.product?.price; // if populated
    if (!price) return;

    total += item.quantity * price;
  });

  return total;
};

/* =========================
   ADD / UPDATE CART ITEM
========================= */
exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, variantId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));

  const variant = product.variants.id(variantId);
  if (!variant) return next(new AppError('Variant not found', 404));

  if (variant.quantity < quantity) {
    return next(new AppError('Not enough stock', 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          variant: {
            id: variant._id,
            color: variant.color.name,
            size: variant.size,
            sku: variant.sku,
          },
          quantity,
        },
      ],
    });
  } else {
    const index = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.id?.toString() === variantId,
    );

    if (index > -1) {
      cart.cartItems[index].quantity = quantity;
    } else {
      cart.cartItems.push({
        product: productId,
        variant: {
          id: variant._id,
          color: variant.color.name,
          size: variant.size,
          sku: variant.sku,
        },
        quantity,
      });
    }
  }

  // build product map for fast price lookup
  await cart.populate('cartItems.product', 'price');
  cart.totalCartPrice = calculateTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/* =========================
   GET CART
========================= */
exports.getLoggedUserCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(200).json({
      status: 'success',
      numOfCartItems: 0,
      data: {
        cartItems: [],
        totalCartPrice: 0,
      },
    });
  }

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
/* =========================
   REMOVE ITEM
========================= */
exports.removeProductFromCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return next(new AppError('Cart not found', 404));

  cart.cartItems = cart.cartItems.filter(
    (item) => item._id.toString() !== req.params.itemId,
  );

  await cart.populate('cartItems.product', 'price imageCover');
  cart.totalCartPrice = calculateTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/* =========================
   CLEAR CART
========================= */
exports.clearLoggedUserCart = catchAsync(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(204).send();
});

/* =========================
   UPDATE QUANTITY
========================= */
exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found', 404));

  const item = cart.cartItems.id(req.params.itemId);
  if (!item) return next(new AppError('Cart item not found', 404));

  const product = await Product.findById(item.product);
  if (!product) return next(new AppError('Product not found', 404));

  const variant = product.variants.id(item.variant.id);
  if (!variant) return next(new AppError('Variant not found', 404));

  if (variant.quantity < quantity) {
    return next(new AppError('Not enough stock', 400));
  }

  item.quantity = quantity;

  await cart.populate('cartItems.product', 'price imageCover');
  cart.totalCartPrice = calculateTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/* =========================
   APPLY COUPON
========================= */
exports.applyCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new AppError('Invalid or expired coupon', 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return next(new AppError('Cart not found', 404));

  const productIds = cart.cartItems.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } }).select(
    'price',
  );

  const productsMap = new Map(products.map((p) => [p._id.toString(), p]));

  const total = calculateTotalPrice(cart, productsMap);

  cart.totalCartPrice = total;
  cart.totalPriceAfterDiscount = Number(
    (total - (total * coupon.discount) / 100).toFixed(2),
  );

  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
