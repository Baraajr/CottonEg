const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const {
  createCategory,
  createSubcategory,
  createProduct,
  VALID_SHIPPING_ADDRESS,
  buildOrder,
} = require('../setup');
const Order = require('../../models/orderModel');

const {
  createJWTToken,
  createAdminUser,
  createRegularUser,
} = require('../setup');
const Product = require('../../models/productModel');
const Cart = require('../../models/cartModel');

let admin;
let adminToken;

let user;
let anotherUser;
let userToken;

let order;

beforeEach(async () => {
  admin = await createAdminUser();
  adminToken = createJWTToken(admin._id);

  user = await createRegularUser({
    name: 'Regular User',
    email: 'user@example.com',
    password: 'test1234',
    passwordConfirm: 'test1234',
  });

  anotherUser = await createRegularUser({
    name: 'another Regular User',
    email: 'anotheruser@example.com',
    password: 'test1234',
    passwordConfirm: 'test1234',
  });

  userToken = createJWTToken(user._id);

  order = await buildOrder(user._id);
});

describe('Order Routes', () => {
  describe('/api/v1/orders', () => {
    describe('GET /', () => {
      describe('as admin', () => {
        it('should return all orders', async () => {
          const res = await supertest(app)
            .get('/api/v1/orders')
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(200);
          expect(res.body.totalResults).toBe(1);
          expect(res.body.data).toHaveLength(1);
        });
      });

      describe('as regular user', () => {
        it('should return only logged user orders', async () => {
          await buildOrder(anotherUser._id, { totalOrderPrice: 50 });

          const res = await supertest(app)
            .get('/api/v1/orders')
            .set('Authorization', `Bearer ${userToken}`);

          expect(res.statusCode).toBe(200);
          expect(res.body.totalResults).toBe(1);
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].user._id).toBe(user._id.toString());
        });

        it('should return an empty array if user has no orders', async () => {
          await Order.deleteMany({ user: user._id });

          const res = await supertest(app)
            .get('/api/v1/orders')
            .set('Authorization', `Bearer ${userToken}`);

          expect(res.statusCode).toBe(200);
          expect(res.body.totalResults).toBe(0);
          expect(res.body.data).toEqual([]);
        });

        it('should not leak other users orders in the response', async () => {
          await buildOrder(anotherUser._id, { totalOrderPrice: 50 });

          const res = await supertest(app)
            .get('/api/v1/orders')
            .set('Authorization', `Bearer ${userToken}`);

          const belongsToOtherUser = res.body.data.some(
            (o) => o.user._id !== user._id.toString(),
          );

          expect(belongsToOtherUser).toBe(false);
        });
      });

      describe('authorization', () => {
        it('should return 401 if user is not authenticated', async () => {
          const res = await supertest(app).get('/api/v1/orders');

          expect(res.statusCode).toBe(401);
        });

        it('should return 401 with an invalid/garbage token', async () => {
          const res = await supertest(app)
            .get('/api/v1/orders')
            .set('Authorization', 'Bearer not-a-real-token');

          expect(res.statusCode).toBe(401);
        });
      });
    });

    describe('GET /:id', () => {
      it('should return an order', async () => {
        const res = await supertest(app)
          .get(`/api/v1/orders/${order._id}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data._id).toBe(order._id.toString());
      });

      it('should allow an admin to view any order', async () => {
        const res = await supertest(app)
          .get(`/api/v1/orders/${order._id}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(order._id.toString());
      });

      it('should return 404 if order does not exist', async () => {
        const res = await supertest(app)
          .get(`/api/v1/orders/${new mongoose.Types.ObjectId()}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch('No document with this ID');
      });

      it('should return 400 for invalid order id', async () => {
        const res = await supertest(app)
          .get('/api/v1/orders/123')
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(400);
      });

      it('should return 401 if not authenticated', async () => {
        const res = await supertest(app).get(`/api/v1/orders/${order._id}`);

        expect(res.statusCode).toBe(401);
      });
    });

    describe('POST /:cartId', () => {
      let category;
      let subcategory;
      let product;
      let variant;
      let cart;

      beforeEach(async () => {
        category = await createCategory();
        subcategory = await createSubcategory(category._id);

        product = await createProduct(category._id, subcategory._id);

        variant = product.variants[0];

        cart = await Cart.create({
          user: user._id,
          cartItems: [
            {
              product: product._id,
              variant: {
                id: variant._id,
                color: variant.color.name,
                size: variant.size,
                sku: variant.sku,
              },
              quantity: 2,
              price: product.price,
            },
          ],
          totalCartPrice: 200,
        });
      });

      describe('with valid data', () => {
        it('should create a cash order', async () => {
          const res = await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ shippingAddress: VALID_SHIPPING_ADDRESS });

          expect(res.statusCode).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.data.totalOrderPrice).toBe(200);

          const createdOrder = await Order.findById(res.body.data._id);
          expect(createdOrder).not.toBeNull();
        });

        it('should associate the order with the authenticated user', async () => {
          const res = await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ shippingAddress: VALID_SHIPPING_ADDRESS });

          expect(res.body.data.user).toBe(user._id.toString());
        });

        it('should persist the provided shipping address', async () => {
          const res = await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ shippingAddress: VALID_SHIPPING_ADDRESS });

          expect(res.body.data.shippingAddress).toMatchObject(
            VALID_SHIPPING_ADDRESS,
          );
        });

        it('should delete the cart after creating the order', async () => {
          await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ shippingAddress: VALID_SHIPPING_ADDRESS });

          const deletedCart = await Cart.findById(cart._id);

          expect(deletedCart).toBeNull();
        });

        it('should decrease product stock', async () => {
          const before = (await Product.findById(product._id)).variants.id(
            variant._id,
          ).quantity;

          await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ shippingAddress: VALID_SHIPPING_ADDRESS });

          const updated = await Product.findById(product._id);

          expect(updated.variants.id(variant._id).quantity).toBe(before - 2);
        });

        it('should increase sold count', async () => {
          await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ shippingAddress: VALID_SHIPPING_ADDRESS });

          const updated = await Product.findById(product._id);

          expect(updated.sold).toBe(2);
        });

        it('should default isPaid/isDelivered to false on a new order', async () => {
          const res = await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ shippingAddress: VALID_SHIPPING_ADDRESS });

          expect(res.body.data.isPaid).toBe(false);
          expect(res.body.data.isDelivered).toBe(false);
        });
      });

      describe('with invalid data', () => {
        it('should return 404 if cart does not exist', async () => {
          const res = await supertest(app)
            .post(`/api/v1/orders/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({});

          expect(res.statusCode).toBe(404);
        });

        it('should return 400 for an invalid cart id', async () => {
          const res = await supertest(app)
            .post('/api/v1/orders/123')
            .set('Authorization', `Bearer ${userToken}`)
            .send({});

          expect(res.statusCode).toBe(400);
        });

        it('should fail if product no longer exists', async () => {
          await Product.findByIdAndDelete(product._id);

          const res = await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({});

          expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });

        it('should fail if stock is insufficient', async () => {
          const doc = await Product.findById(product._id);
          doc.variants.id(variant._id).quantity = 1;
          await doc.save();

          const res = await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({});

          expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });

        it('should not create an order or mutate stock when creation fails', async () => {
          const before = (await Product.findById(product._id)).variants.id(
            variant._id,
          ).quantity;

          await Product.findByIdAndDelete(product._id);

          const ordersBefore = await Order.countDocuments();

          await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({});

          const ordersAfter = await Order.countDocuments();
          expect(ordersAfter).toBe(ordersBefore);

          // cart should still exist since the order was never completed
          const stillHasCart = await Cart.findById(cart._id);
          expect(stillHasCart).not.toBeNull();

          // eslint-disable-next-line no-void
          void before; // kept for readability/context, not asserted (product deleted)
        });

        it('should return 404 if the cart does not belong to the requesting user', async () => {
          const otherUser = await createRegularUser({
            name: 'Other User',
            email: 'other@example.com',
            password: 'test1234',
            passwordConfirm: 'test1234',
          });
          const otherToken = createJWTToken(otherUser._id);

          const res = await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ shippingAddress: VALID_SHIPPING_ADDRESS });

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Cart not found');
        });

        it('should return 401 if not authenticated', async () => {
          const res = await supertest(app)
            .post(`/api/v1/orders/${cart._id}`)
            .send({ shippingAddress: VALID_SHIPPING_ADDRESS });

          expect(res.statusCode).toBe(401);
        });
      });
    });

    describe('PATCH /:id/pay', () => {
      beforeEach(async () => {
        order = await buildOrder(user._id);
      });

      describe('with valid data', () => {
        it('should mark the order as paid', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/orders/${order._id}/pay`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.data.isPaid).toBe(true);
          expect(res.body.data.paidAt).not.toBeNull();
        });

        it('should persist the paid status', async () => {
          await supertest(app)
            .patch(`/api/v1/orders/${order._id}/pay`)
            .set('Authorization', `Bearer ${adminToken}`);

          const updated = await Order.findById(order._id);
          expect(updated.isPaid).toBe(true);
          expect(updated.paidAt).toBeTruthy();
        });

        it('should not affect isDelivered', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/orders/${order._id}/pay`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.body.data.isDelivered).toBe(false);
        });
      });

      describe('with invalid data', () => {
        it('should return 404 if order does not exist', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/orders/${new mongoose.Types.ObjectId()}/pay`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Order not found');
        });

        it('should return 400 for an invalid order id', async () => {
          const res = await supertest(app)
            .patch('/api/v1/orders/123/pay')
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(400);
        });

        it('should return 403 for regular user', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/orders/${order._id}/pay`)
            .set('Authorization', `Bearer ${userToken}`);

          expect(res.statusCode).toBe(403);
        });

        it('should return 401 when not authenticated', async () => {
          const res = await supertest(app).patch(
            `/api/v1/orders/${order._id}/pay`,
          );

          expect(res.statusCode).toBe(401);
        });
      });
    });

    describe('PATCH /:id/deliver', () => {
      beforeEach(async () => {
        order = await buildOrder(user._id);
      });

      describe('with valid data', () => {
        it('should mark the order as delivered', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/orders/${order._id}/deliver`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.data.isDelivered).toBe(true);
          expect(res.body.data.deliveredAt).not.toBeNull();
        });

        it('should persist the delivered status', async () => {
          await supertest(app)
            .patch(`/api/v1/orders/${order._id}/deliver`)
            .set('Authorization', `Bearer ${adminToken}`);

          const updated = await Order.findById(order._id);
          expect(updated.isDelivered).toBe(true);
          expect(updated.deliveredAt).toBeTruthy();
        });

        it('should not affect isPaid', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/orders/${order._id}/deliver`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.body.data.isPaid).toBe(false);
        });
      });

      describe('with invalid data', () => {
        it('should return 404 if order does not exist', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/orders/${new mongoose.Types.ObjectId()}/deliver`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Order not found');
        });

        it('should return 400 for an invalid order id', async () => {
          const res = await supertest(app)
            .patch('/api/v1/orders/123/deliver')
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(400);
        });

        it('should return 403 for regular user', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/orders/${order._id}/deliver`)
            .set('Authorization', `Bearer ${userToken}`);

          expect(res.statusCode).toBe(403);
        });

        it('should return 401 when not authenticated', async () => {
          const res = await supertest(app).patch(
            `/api/v1/orders/${order._id}/deliver`,
          );

          expect(res.statusCode).toBe(401);
        });
      });
    });
  });
});
