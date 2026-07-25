const express = require('express');
const authControllers = require('../controllers/authControllers');
const orderControllers = require('../controllers/orderControllers');

const router = express.Router();

router.use(authControllers.protect);

router.post('/checkout-session/:cartId', orderControllers.getCheckoutSession);

router
  .route('/')
  .get(
    authControllers.restrictTo('admin', 'user'),
    orderControllers.filterOrdersForLoggedUser,
    orderControllers.getAllOrders,
  );
router.get('/:id', orderControllers.getOrder);

router.post(
  '/:cartId',
  authControllers.restrictTo('user'),
  orderControllers.createCashOrder,
);

router.patch(
  '/:id/pay',
  authControllers.restrictTo('admin', 'manager'),
  orderControllers.updateOrderPaidStatus,
);

router.patch(
  '/:id/deliver',
  authControllers.restrictTo('admin', 'manager'),
  orderControllers.updateOrderDeliveredStatus,
);

module.exports = router;
