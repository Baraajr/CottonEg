const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel');
const {
  createJWTToken,
  createRegularUser,
  createCategory,
  createSubcategory,
  createProduct,
} = require('../setup');

let user;
let token;
let category;
let subcategory;
let product;
let variant;
let cartItemId;

beforeEach(async () => {
  user = await createRegularUser();
  token = createJWTToken(user._id);

  category = await createCategory();
  subcategory = await createSubcategory(category._id);

  product = await createProduct(category._id, subcategory._id);
  variant = product.variants[0];
});

describe('Cart Routes', () => {
  describe('/api/v1/cart', () => {
    describe('GET /', () => {
      describe('when cart exists', () => {
        beforeEach(async () => {
          await Cart.create({
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
              },
            ],
            totalCartPrice: 200,
          });
        });

        it('should return the logged user cart', async () => {
          const res = await supertest(app)
            .get('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`);

          expect(res.statusCode).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.numOfCartItems).toBe(1);
          expect(res.body.data).toHaveProperty('cartItems');
          expect(res.body.data.cartItems).toHaveLength(1);
        });
      });

      describe('when cart does not exist', () => {
        it('should return an empty cart', async () => {
          const res = await supertest(app)
            .get('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`);

          expect(res.statusCode).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.numOfCartItems).toBe(0);
          expect(res.body.data.cartItems).toEqual([]);
          expect(res.body.data.totalCartPrice).toBe(0);
        });
      });
    });

    describe('POST /', () => {
      describe('with valid data', () => {
        it('should create a cart if none exists', async () => {
          const res = await supertest(app)
            .post('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
              productId: product._id,
              variantId: variant._id,
              quantity: 2,
            });

          expect(res.statusCode).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.numOfCartItems).toBe(1);

          expect(res.body.data.cartItems[0].quantity).toBe(2);
          expect(res.body.data.totalCartPrice).toBe(200);

          cartItemId = res.body.data.cartItems[0]._id;
        });

        it('should default quantity to 1 when not provided', async () => {
          const res = await supertest(app)
            .post('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
              productId: product._id,
              variantId: variant._id,
            });

          expect(res.statusCode).toBe(200);
          expect(res.body.data.cartItems[0].quantity).toBe(1);
          expect(res.body.data.totalCartPrice).toBe(100);
        });

        it('should add a new cart item for a different variant of the same product', async () => {
          const secondVariant = {
            size: 'L',
            color: {
              name: 'White',
              hex: '#FFFFFF',
            },
            quantity: 10,
            sku: 'TEST-WHT-L',
          };

          product.variants.push(secondVariant);
          await product.save();

          const variant2 = product.variants[1];

          await Cart.create({
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
                quantity: 1,
              },
            ],
          });

          const res = await supertest(app)
            .post('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
              productId: product._id,
              variantId: variant2._id,
              quantity: 1,
            });

          expect(res.statusCode).toBe(200);
          expect(res.body.numOfCartItems).toBe(2);
        });

        it('should add another product if variant does not exist in cart', async () => {
          await Cart.create({
            user: user._id,
            cartItems: [
              {
                product: product._id,
                variant: {
                  id: new mongoose.Types.ObjectId(),
                  color: 'Blue',
                  size: 'L',
                  sku: 'SKU-2',
                },
                quantity: 1,
              },
            ],
          });

          const res = await supertest(app)
            .post('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
              productId: product._id,
              variantId: variant._id,
              quantity: 2,
            });

          expect(res.statusCode).toBe(200);
          expect(res.body.numOfCartItems).toBe(2);
        });

        it('should increase quantity if item already exists', async () => {
          await Cart.create({
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
              },
            ],
          });

          const res = await supertest(app)
            .post('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
              productId: product._id,
              variantId: variant._id,
              quantity: 3,
            });

          expect(res.statusCode).toBe(200);
          expect(res.body.data.cartItems[0].quantity).toBe(5);
        });
      });

      describe('with invalid data', () => {
        it('should return 404 if product does not exist', async () => {
          const res = await supertest(app)
            .post('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
              productId: new mongoose.Types.ObjectId(),
              variantId: variant._id,
              quantity: 1,
            });

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Product not found');
        });

        it('should return 404 if variant does not exist', async () => {
          const res = await supertest(app)
            .post('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
              productId: product._id,
              variantId: new mongoose.Types.ObjectId(),
              quantity: 1,
            });

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Variant not found');
        });

        it('should return 400 if requested quantity exceeds stock', async () => {
          const res = await supertest(app)
            .post('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
              productId: product._id,
              variantId: variant._id,
              quantity: 100,
            });

          expect(res.statusCode).toBe(400);
          expect(res.body.message).toBe('Not enough stock');
        });

        it('should return 400 when increasing quantity beyond stock', async () => {
          await Cart.create({
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
                quantity: 8,
              },
            ],
          });

          const res = await supertest(app)
            .post('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
              productId: product._id,
              variantId: variant._id,
              quantity: 3,
            });

          expect(res.statusCode).toBe(400);
          expect(res.body.message).toBe('Not enough stock');
        });
      });
    });

    describe('PATCH /:itemId', () => {
      beforeEach(async () => {
        const cart = await Cart.create({
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
            },
          ],
        });

        cartItemId = cart.cartItems[0]._id;
      });

      describe('with valid data', () => {
        it('should allow quantity equal to available stock', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/cart/${cartItemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 10 });

          expect(res.statusCode).toBe(200);
          expect(res.body.data.cartItems[0].quantity).toBe(10);
        });

        it('should update item quantity', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/cart/${cartItemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 5 });

          expect(res.statusCode).toBe(200);
          expect(res.body.data.cartItems[0].quantity).toBe(5);
          expect(res.body.data.totalCartPrice).toBe(500);
        });
      });

      describe('with invalid data', () => {
        it('should return 404 if variant does not exist', async () => {
          const cart = await Cart.findOne({ user: user._id });

          const productDoc = await Product.findById(product._id);

          productDoc.variants.push({
            size: 'L',
            color: {
              name: 'White',
              hex: '#FFFFFF',
            },
            quantity: 10,
            sku: 'TEST-WHT-L',
          });

          productDoc.variants.pull(variant._id);

          await productDoc.save();

          const res = await supertest(app)
            .patch(`/api/v1/cart/${cart.cartItems[0]._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 2 });

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Variant not found');
        });

        it('should return 404 if cart does not exist', async () => {
          await Cart.deleteMany({});

          const res = await supertest(app)
            .patch(`/api/v1/cart/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 2 });

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Cart not found');
        });

        it('should return 404 if cart item does not exist', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/cart/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 2 });

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Cart item not found');
        });

        it('should return 400 if quantity exceeds stock', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/cart/${cartItemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 100 });

          expect(res.statusCode).toBe(400);
          expect(res.body.message).toBe('Not enough stock');
        });

        it('should return 404 if product no longer exists', async () => {
          await Product.findByIdAndDelete(product._id);

          const res = await supertest(app)
            .patch(`/api/v1/cart/${cartItemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 2 });

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Product not found');
        });
      });
    });

    describe('DELETE /:itemId', () => {
      beforeEach(async () => {
        const cart = await Cart.create({
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
            },
          ],
          totalCartPrice: 200,
        });

        cartItemId = cart.cartItems[0]._id;
      });

      describe('with valid data', () => {
        it('should remove an item from the cart', async () => {
          const res = await supertest(app)
            .delete(`/api/v1/cart/${cartItemId}`)
            .set('Authorization', `Bearer ${token}`);

          expect(res.statusCode).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.numOfCartItems).toBe(0);
          expect(res.body.data.cartItems).toHaveLength(0);
          expect(res.body.data.totalCartPrice).toBe(0);
        });
      });

      describe('with invalid data', () => {
        it('should return 404 if cart does not exist', async () => {
          await Cart.deleteMany({});

          const res = await supertest(app)
            .delete(`/api/v1/cart/${cartItemId}`)
            .set('Authorization', `Bearer ${token}`);

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Cart not found');
        });
      });
    });

    describe('DELETE /', () => {
      beforeEach(async () => {
        await Cart.create({
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
            },
          ],
        });
      });

      describe('when cart exists', () => {
        it('should clear the logged user cart', async () => {
          const res = await supertest(app)
            .delete('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`);

          expect(res.statusCode).toBe(204);

          const cart = await Cart.findOne({ user: user._id });
          expect(cart).toBeNull();
        });
      });

      describe('when cart does not exist', () => {
        it('should still return 204', async () => {
          await Cart.deleteMany({});

          const res = await supertest(app)
            .delete('/api/v1/cart')
            .set('Authorization', `Bearer ${token}`);

          expect(res.statusCode).toBe(204);

          const cart = await Cart.findOne({ user: user._id });
          expect(cart).toBeNull();
        });
      });
    });
  });
});
