const request = require('supertest');
const app = require('../../app');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const {
  createRegularUser,
  createJWTToken,
  createCategory,
  createSubcategory,
  createProduct,
} = require('../setup');

describe('Wishlist Routes', () => {
  let user;
  let token;
  let product;

  beforeEach(async () => {
    user = await createRegularUser();
    token = createJWTToken(user._id);

    const category = await createCategory();

    const subcategory = await createSubcategory(category._id);

    product = await createProduct(category._id, subcategory._id);
  });

  describe('POST /api/v1/wishlist', () => {
    it('should add product to wishlist', async () => {
      const res = await request(app)
        .post('/api/v1/wishlist')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: product._id,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toContainEqual(product._id.toString());

      const updatedUser = await User.findById(user._id);

      expect(updatedUser.wishlist).toHaveLength(1);
      expect(updatedUser.wishlist[0].toString()).toBe(product._id.toString());
    });

    it('should not add duplicate product to wishlist', async () => {
      await User.findByIdAndUpdate(user._id, {
        wishlist: [product._id],
      });

      const res = await request(app)
        .post('/api/v1/wishlist')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: product._id,
        });

      expect(res.statusCode).toBe(200);

      const updatedUser = await User.findById(user._id);

      expect(updatedUser.wishlist).toHaveLength(1);
    });

    it('should return 401 if user is not logged in', async () => {
      const res = await request(app).post('/api/v1/wishlist').send({
        productId: product._id,
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/v1/wishlist/:productId', () => {
    it('should remove product from wishlist', async () => {
      await User.findByIdAndUpdate(user._id, {
        wishlist: [product._id],
      });

      const res = await request(app)
        .delete(`/api/v1/wishlist/${product._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Product removed from wishlist');

      const updatedUser = await User.findById(user._id);

      expect(updatedUser.wishlist).toHaveLength(0);
    });

    it('should return 401 if user is not logged in', async () => {
      const res = await request(app).delete(`/api/v1/wishlist/${product._id}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/v1/wishlist', () => {
    it('should get logged user wishlist', async () => {
      await User.findByIdAndUpdate(user._id, {
        wishlist: [product._id],
      });

      const res = await request(app)
        .get('/api/v1/wishlist')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.result).toBe(1);

      expect(res.body.data[0]._id).toBe(product._id.toString());
    });

    it('should return empty wishlist if user has no products', async () => {
      const res = await request(app)
        .get('/api/v1/wishlist')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toBe(0);
      expect(res.body.data).toEqual([]);
    });

    it('should return 401 if user is not logged in', async () => {
      const res = await request(app).get('/api/v1/wishlist');

      expect(res.statusCode).toBe(401);
    });
  });
});
