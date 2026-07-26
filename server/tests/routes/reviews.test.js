const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Review = require('../../models/reviewModel');
const {
  createCategory,
  createSubcategory,
  createProduct,
  createJWTToken,
  createAdminUser,
  createRegularUser,
} = require('../setup');

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

let admin;
let adminToken;

let user;
let userToken;

let category;
let subcategory;
let product;
let review;

beforeEach(async () => {
  admin = await createAdminUser();
  adminToken = createJWTToken(admin._id);

  user = await createRegularUser({
    name: 'Regular User',
    email: 'user@example.com',
    password: 'test1234',
    passwordConfirm: 'test1234',
  });
  userToken = createJWTToken(user._id);

  category = await createCategory();
  subcategory = await createSubcategory(category._id);
  product = await createProduct(category._id, subcategory._id);

  review = await Review.create({
    title: 'Excellent product',
    ratings: 5,
    user: user._id,
    product: product._id,
  });
});

describe('Review Routes', () => {
  describe('/api/v1/reviews', () => {
    describe('GET /', () => {
      it('should return all reviews', async () => {
        const res = await supertest(app).get('/api/v1/reviews');

        expect(res.statusCode).toBe(200);
        expect(res.body.totalResults).toBe(1);
        expect(res.body.data).toHaveLength(1);
      });

      it('should filter reviews by product', async () => {
        const product2 = await createProduct(category._id, subcategory._id, {
          name: 'new product11',
        });
        await Review.create({
          title: 'Another review',
          ratings: 4,
          user: user._id,
          product: product2._id,
        });

        const res = await supertest(app).get(
          `/api/v1/products/${product._id}/reviews`,
        );

        expect(res.statusCode).toBe(200);
        expect(res.body.totalResults).toBe(1);
        expect(res.body.data[0].product).toBe(product._id.toString());
      });

      it('should return an empty array when no reviews exist', async () => {
        await Review.deleteMany({});

        const res = await supertest(app).get('/api/v1/reviews');

        expect(res.statusCode).toBe(200);
        expect(res.body.totalResults).toBe(0);
        expect(res.body.data).toEqual([]);
      });
    });

    describe('POST /', () => {
      // The shared beforeEach already creates a review for `user` on
      // `product`, and a user can only review a given product once. Every
      // test here except the "duplicate review" case needs a product the
      // user hasn't reviewed yet, so we create one locally.
      let unreviewedProduct;

      beforeEach(async () => {
        unreviewedProduct = await createProduct(category._id, subcategory._id, {
          name: 'Unreviewed Product',
        });
      });

      describe('with valid data', () => {
        it('should create a review', async () => {
          const res = await supertest(app)
            .post(`/api/v1/products/${unreviewedProduct._id}/reviews`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              title: 'Amazing product',
              ratings: 5,
            });

          expect(res.statusCode).toBe(201);
          expect(res.body.status).toBe('success');
          expect(res.body.data.title).toBe('Amazing product');
          expect(res.body.data.ratings).toBe(5);
        });

        it('should set product id from route params', async () => {
          const res = await supertest(app)
            .post(`/api/v1/products/${unreviewedProduct._id}/reviews`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              title: 'Amazing product',
              ratings: 5,
            });

          expect(res.body.data.product).toBe(unreviewedProduct._id.toString());
        });
      });

      describe('with invalid data', () => {
        it('should return validation error', async () => {
          const res = await supertest(app)
            .post(`/api/v1/products/${unreviewedProduct._id}/reviews`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({});

          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty('message');
        });

        it('should return 400 for invalid product id', async () => {
          const res = await supertest(app)
            .post('/api/v1/products/123/reviews')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              title: 'Good',
              ratings: 5,
            });

          expect(res.statusCode).toBe(400);
        });

        it('should not allow the same user to review the same product twice', async () => {
          // `product` (not `unreviewedProduct`) already has a review from
          // `user`, created in the shared beforeEach — that's the point.
          const res = await supertest(app)
            .post(`/api/v1/products/${product._id}/reviews`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              title: 'Second',
              ratings: 4,
            });

          expect(res.statusCode).toBe(400);
          expect(res.body.message).toMatch(
            'You already created a review for this product',
          );
        });

        it('should return 401 if not authenticated', async () => {
          const res = await supertest(app)
            .post(`/api/v1/products/${unreviewedProduct._id}/reviews`)
            .send({
              title: 'Amazing',
              ratings: 5,
            });

          expect(res.statusCode).toBe(401);
        });

        it('should return 403 if admin tries to create review', async () => {
          const res = await supertest(app)
            .post(`/api/v1/products/${unreviewedProduct._id}/reviews`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              title: 'Amazing',
              ratings: 5,
            });

          expect(res.statusCode).toBe(403);
        });
      });
    });

    describe('GET /:id', () => {
      it('should return a review', async () => {
        const res = await supertest(app).get(`/api/v1/reviews/${review._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data._id).toBe(review._id.toString());
      });

      it('should return 404 if review does not exist', async () => {
        const res = await supertest(app).get(
          `/api/v1/reviews/${new mongoose.Types.ObjectId()}`,
        );

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch('No document with this ID');
      });

      it('should return 400 for invalid review id', async () => {
        const res = await supertest(app).get('/api/v1/reviews/123');

        expect(res.statusCode).toBe(400);
      });
    });

    describe('PATCH /:id', () => {
      describe('with valid data', () => {
        it('should update a review', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/reviews/${review._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              title: 'Updated review',
              ratings: 5,
            });

          expect(res.statusCode).toBe(200);
          expect(res.body.status).toBe('success');
          expect(res.body.data.title).toBe('Updated review');
          expect(res.body.data.ratings).toBe(5);
        });
      });

      describe('with invalid data', () => {
        it('should return 400 if review does not exist', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/reviews/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              title: 'Updated',
            });

          expect(res.statusCode).toBe(400);
          expect(res.body.message).toMatch('There is no review with id');
        });

        it('should return 400 for invalid review id', async () => {
          const res = await supertest(app)
            .patch('/api/v1/reviews/123')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              title: 'Updated',
            });

          expect(res.statusCode).toBe(400);
        });

        it('should return 401 if not authenticated', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/reviews/${review._id}`)
            .send({
              title: 'Updated',
            });

          expect(res.statusCode).toBe(401);
        });

        it('should return 400 when another user updates the review', async () => {
          const anotherUser = await createRegularUser({
            name: 'Another',
            email: 'another@test.com',
            password: 'test1234',
            passwordConfirm: 'test1234',
          });
          const anotherToken = createJWTToken(anotherUser._id);

          const res = await supertest(app)
            .patch(`/api/v1/reviews/${review._id}`)
            .set('Authorization', `Bearer ${anotherToken}`)
            .send({
              title: 'Updated',
            });

          expect(res.statusCode).toBe(400);
          expect(res.body.message).toBe(
            'You do not have permission to perform this action',
          );
        });
      });
    });

    describe('DELETE /:id', () => {
      describe('with valid data', () => {
        it('should allow owner to delete review', async () => {
          const res = await supertest(app)
            .delete(`/api/v1/reviews/${review._id}`)
            .set('Authorization', `Bearer ${userToken}`);

          expect(res.statusCode).toBe(204);

          const deleted = await Review.findById(review._id);
          expect(deleted).toBeNull();
        });

        it('should allow admin to delete any review', async () => {
          const res = await supertest(app)
            .delete(`/api/v1/reviews/${review._id}`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(204);
        });
      });

      describe('with invalid data', () => {
        it('should return 404 if review does not exist', async () => {
          const res = await supertest(app)
            .delete(`/api/v1/reviews/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toMatch('No document with this ID');
        });

        it('should return 400 for invalid review id', async () => {
          const res = await supertest(app)
            .delete('/api/v1/reviews/123')
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(400);
        });

        it('should return 401 if not authenticated', async () => {
          const res = await supertest(app).delete(
            `/api/v1/reviews/${review._id}`,
          );

          expect(res.statusCode).toBe(401);
        });

        it('should return 400 when another user deletes the review', async () => {
          const anotherUser = await createRegularUser({
            name: 'Another',
            email: 'delete@test.com',
            password: 'test1234',
            passwordConfirm: 'test1234',
          });
          const anotherToken = createJWTToken(anotherUser._id);

          const res = await supertest(app)
            .delete(`/api/v1/reviews/${review._id}`)
            .set('Authorization', `Bearer ${anotherToken}`);

          expect(res.statusCode).toBe(400);
          expect(res.body.message).toBe(
            'You do not have permission to perform this action',
          );
        });
      });
    });
  });
});
