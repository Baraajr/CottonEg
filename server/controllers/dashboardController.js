const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.getDashboard = async (req, res, next) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      users,
      products,
      orders,
      revenue,
      monthlyRevenue,
      productsSold,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      User.countDocuments(),

      Product.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: { $cond: ['$isActive', 1, 0] },
            },
            inactive: {
              $sum: { $cond: ['$isActive', 0, 1] },
            },
            outOfStock: {
              $sum: { $cond: [{ $lte: ['$quantity', 0] }, 1, 0] },
            },
            lowStock: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gt: ['$quantity', 0] },
                      { $lte: ['$quantity', 10] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            paid: {
              $sum: { $cond: ['$isPaid', 1, 0] },
            },
            unpaid: {
              $sum: { $cond: ['$isPaid', 0, 1] },
            },
            delivered: {
              $sum: { $cond: ['$isDelivered', 1, 0] },
            },
            pendingDelivery: {
              $sum: { $cond: ['$isDelivered', 0, 1] },
            },
          },
        },
      ]),

      Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalOrderPrice' },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            isPaid: true,
            createdAt: { $gte: startOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalOrderPrice' },
          },
        },
      ]),

      Order.aggregate([
        { $match: { isPaid: true } },
        { $unwind: '$cartItems' },
        {
          $group: {
            _id: null,
            total: { $sum: '$cartItems.quantity' },
          },
        },
      ]),

      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          'user cartItems totalOrderPrice paymentMethodType isPaid isDelivered createdAt',
        )
        .lean(),

      Order.aggregate([
        { $match: { isPaid: true } },
        { $unwind: '$cartItems' },
        {
          $group: {
            _id: '$cartItems.product',
            sold: { $sum: '$cartItems.quantity' },
            revenue: {
              $sum: {
                $multiply: ['$cartItems.quantity', '$cartItems.price'],
              },
            },
          },
        },
        { $sort: { sold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: '$product' },
        {
          $project: {
            _id: 1,
            sold: 1,
            revenue: 1,
            name: '$product.name',
            imageCover: '$product.imageCover',
          },
        },
      ]),
    ]);

    res.status(200).json({
      status: 'success',

      data: {
        users: {
          total: users,
        },

        products: products[0] || {
          total: 0,
          active: 0,
          inactive: 0,
          outOfStock: 0,
          lowStock: 0,
        },

        orders: orders[0] || {
          total: 0,
          paid: 0,
          unpaid: 0,
          delivered: 0,
          pendingDelivery: 0,
        },

        revenue: {
          total: revenue[0]?.total || 0,
          thisMonth: monthlyRevenue[0]?.total || 0,
        },

        productsSold: productsSold[0]?.total || 0,

        recentOrders,

        topProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};
