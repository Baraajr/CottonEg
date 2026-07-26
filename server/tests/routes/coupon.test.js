const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Coupon = require('../../models/couponModel');
const {
  createAdminUser,
  createJWTToken,
  createRegularUser,
} = require('../setup');

let admin;
let token;
let coupon;

beforeEach(async () => {
  admin = await createAdminUser();
  token = createJWTToken(admin._id);

  coupon = await Coupon.create({
    name: 'SUMMER20',
    expire: new Date(Date.now() + 86400000),
    discount: 20,
  });
});

describe('Coupon Routes', () => {
  describe('/api/v1/coupons', () => {
    describe('GET /', () => {
      it('should return 401 if user is not authenticated', async () => {
        const res = await supertest(app).get('/api/v1/coupons');

        expect(res.statusCode).toBe(401);
      });

      it('should return 403 if user is not an admin', async () => {
        const user = await createRegularUser();
        const userToken = createJWTToken(user._id);

        const res = await supertest(app)
          .get('/api/v1/coupons')
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(403);
      });

      it('should return all coupons', async () => {
        const res = await supertest(app)
          .get('/api/v1/coupons')
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.totalResults).toBe(1);
        expect(res.body.data).toHaveLength(1);
      });
    });

    describe('POST /', () => {
      describe('with valid data', () => {
        it('should create a coupon', async () => {
          const res = await supertest(app)
            .post('/api/v1/coupons')
            .set('Authorization', `Bearer ${token}`)
            .send({
              name: 'WINTER30',
              expire: new Date(Date.now() + 86400000),
              discount: 30,
            });

          expect(res.statusCode).toBe(201);
          expect(res.body.data.name).toBe('WINTER30');
          expect(res.body.data.discount).toBe(30);
        });
      });

      describe('with invalid data', () => {
        it('should return validation error', async () => {
          const res = await supertest(app)
            .post('/api/v1/coupons')
            .set('Authorization', `Bearer ${token}`)
            .send({});

          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty('message');
        });
      });
    });

    describe('GET /:id', () => {
      it('should return a coupon', async () => {
        const res = await supertest(app)
          .get(`/api/v1/coupons/${coupon._id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(coupon._id.toString());
      });

      it('should return 404 if coupon does not exist', async () => {
        const res = await supertest(app)
          .get(`/api/v1/coupons/${new mongoose.Types.ObjectId()}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch('No document with this ID');
      });
    });

    describe('PATCH /:id', () => {
      describe('with valid data', () => {
        it('should update a coupon', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/coupons/${coupon._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              discount: 50,
            });

          expect(res.statusCode).toBe(200);
          expect(res.body.data.discount).toBe(50);
        });
      });

      describe('with invalid data', () => {
        it('should return 404 if coupon does not exist', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/coupons/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              discount: 50,
            });

          expect(res.statusCode).toBe(404);
          expect(res.body.message).toMatch('No document with this ID');
        });
      });
    });

    describe('DELETE /:id', () => {
      it('should delete a coupon', async () => {
        const res = await supertest(app)
          .delete(`/api/v1/coupons/${coupon._id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(204);

        const deletedCoupon = await Coupon.findById(coupon._id);
        expect(deletedCoupon).toBeNull();
      });

      it('should return 404 if coupon does not exist', async () => {
        const res = await supertest(app)
          .delete(`/api/v1/coupons/${new mongoose.Types.ObjectId()}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch('No document with this ID');
      });
    });
  });
});
