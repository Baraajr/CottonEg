const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

/* =========================
   CASH ORDER (TRANSACTION SAFE)
========================= */
exports.createCashOrder = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const taxPrice = 0;
    const shippingPrice = 0;

    const cart = await Cart.findById(req.params.cartId).session(session);
    if (!cart) throw new Error('Cart not found');

    const cartPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 1) VALIDATE STOCK (important fix)
    for (const item of cart.cartItems) {
      const product = await Product.findById(item.product).session(session);

      const variant = product?.variants.id(item.variant);

      if (!product || !variant || variant.quantity < item.quantity) {
        throw new Error('Insufficient stock for one or more items');
      }
    }

    // 2) CREATE ORDER
    const order = await Order.create(
      [
        {
          user: req.user._id,
          cartItems: cart.cartItems.map((item) => ({
            product: item.product,
            variant: item.variant,
            quantity: item.quantity,
            price: item.price,
          })),
          totalOrderPrice,
          shippingAddress: req.body.shippingAddress,
        },
      ],
      { session },
    );

    // 3) ATOMIC STOCK UPDATE (variant level safe)
    for (const item of cart.cartItems) {
      const result = await Product.updateOne(
        {
          _id: item.product,
          'variants._id': item.variant,
          'variants.quantity': { $gte: item.quantity },
        },
        {
          $inc: {
            'variants.$.quantity': -item.quantity,
            sold: item.quantity,
          },
        },
        { session },
      );

      if (result.modifiedCount === 0) {
        throw new Error('Stock conflict detected');
      }
    }

    // 4) DELETE CART
    await Cart.findByIdAndDelete(req.params.cartId).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      data: order[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
});

/* =========================
   FILTER ORDERS
========================= */
exports.filterOrdersForLoggedUser = (req, res, next) => {
  if (req.user.role === 'user') {
    req.filterObj = { user: req.user._id };
  }
  next();
};

/* =========================
   GET ALL ORDERS
========================= */
exports.getAllOrders = factory.getAll(Order);

/* =========================
   GET SINGLE ORDER
========================= */
exports.getOrder = factory.getOne(Order);

/* =========================
   UPDATE PAID STATUS
========================= */
exports.updateOrderPaidStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));

  order.isPaid = true;
  order.paidAt = Date.now();

  await order.save();

  res.status(200).json({
    status: 'success',
    data: order,
  });
});

/* =========================
   UPDATE DELIVERY STATUS
========================= */
exports.updateOrderDeliveredStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    status: 'success',
    data: order,
  });
});

/* =========================
   STRIPE CHECKOUT SESSION
========================= */
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findById(req.params.cartId);
  if (!cart) return next(new AppError('Cart not found', 404));

  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',

    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: `Order for ${req.user.name}`,
          },
          unit_amount: Math.round(totalOrderPrice * 100),
        },
        quantity: 1,
      },
    ],

    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL,

    customer_email: req.user.email,
    client_reference_id: cart.id,

    metadata: {
      shippingAddress: JSON.stringify(req.body.shippingAddress || {}),
    },
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

/* =========================
   STRIPE ORDER CREATION (TRANSACTION SAFE + ID EMPOTENT)
========================= */
const createOrder = async (sessionData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cartId = sessionData.client_reference_id;

    const cart = await Cart.findById(cartId).session(session);
    const user = await User.findOne({
      email: sessionData.customer_email,
    }).session(session);

    if (!cart || !user) throw new Error('Missing cart or user');

    // OPTIONAL: prevent duplicate orders
    const existing = await Order.findOne({
      paymentReference: sessionData.id,
    }).session(session);

    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 1) VALIDATE STOCK
    for (const item of cart.cartItems) {
      const product = await Product.findById(item.product).session(session);
      const variant = product?.variants.id(item.variant);

      if (!product || !variant || variant.quantity < item.quantity) {
        throw new Error('Insufficient stock');
      }
    }

    // 2) CREATE ORDER
    const order = await Order.create(
      [
        {
          user: user._id,
          cartItems: cart.cartItems.map((item) => ({
            product: item.product,
            variant: item.variant,
            quantity: item.quantity,
            price: item.price,
          })),
          totalOrderPrice: sessionData.amount_total / 100,
          shippingAddress: JSON.parse(
            sessionData.metadata.shippingAddress || '{}',
          ),
          isPaid: true,
          paidAt: Date.now(),
          paymentMethodType: 'card',
          paymentReference: sessionData.id,
        },
      ],
      { session },
    );

    // 3) ATOMIC STOCK UPDATE
    for (const item of cart.cartItems) {
      const result = await Product.updateOne(
        {
          _id: item.product,
          'variants._id': item.variant,
          'variants.quantity': { $gte: item.quantity },
        },
        {
          $inc: {
            'variants.$.quantity': -item.quantity,
            sold: item.quantity,
          },
        },
        { session },
      );

      if (result.modifiedCount === 0) {
        throw new Error('Stock conflict detected');
      }
    }

    // 4) DELETE CART
    await Cart.findByIdAndDelete(cartId).session(session);

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
  }
};

/* =========================
   STRIPE WEBHOOK
========================= */
exports.webhookCheckout = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  if (event.type === 'checkout.session.completed') {
    await createOrder(event.data.object);
  }

  res.status(200).json({ received: true });
};
