const supertest = require('supertest');
const app = require('../../app');
const {
  createAdminUser,
  createJWTToken,
  createCategory,
  createRegularUser,
} = require('../setup');

let adminToken;
let userToken;

beforeEach(async () => {
  const adminUser = await createAdminUser();
  adminToken = createJWTToken(adminUser._id);
});

describe('Testing cateory routes ', () => {
  describe('/api/v1/cateories', () => {
    describe('GET', () => {
      it('should return an array of cateories', async () => {
        const res = await supertest(app).get('/api/v1/categories');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBeTruthy();
      });
    });

    describe('POST', () => {
      describe('without a login token', () => {
        it('should return 401 Unauthorized', async () => {
          const res = await supertest(app)
            .post('/api/v1/categories')
            .send({
              name: 'Men',
              genders: ['men'],
            });
          expect(res.status).toBe(401);
          expect(res.body.message).toBe(
            'You are not logged in. Please log in to get access.',
          );
        });
      });

      describe('with regular user token', () => {
        it('Should returns 403 Forbidden', async () => {
          const regularUser = await createRegularUser();
          userToken = createJWTToken(regularUser._id);

          const res = await supertest(app)
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              name: 'Men',
              genders: ['men'],
            });

          expect(res.status).toBe(403);
          expect(res.body.message).toBe(
            'you do not have permission to perform this action',
          );
        });
      });

      describe('with Admin token', () => {
        describe('with all required fields', () => {
          it('should Return 201 Created', async () => {
            const res = await supertest(app)
              .post('/api/v1/categories')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'new category',
                genders: ['men'],
              });

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('name', 'new category');
          });
        });

        describe('with missing name', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/categories')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('category name required');
          });
        });

        describe('with short name', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/categories')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'ab',
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Too short category name');
          });
        });

        describe('with duplicate name', () => {
          it('should Return 400 ', async () => {
            const newCategory = await createCategory();
            const res = await supertest(app)
              .post('/api/v1/categories')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: newCategory.name,
                genders: ['men'],
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/Duplicate field name: /i);
          });
        });
      });
    });
  });

  describe('/api/v1/categories/:id', () => {
    describe('GET', () => {
      describe('with valid id', () => {
        it('should return a single category', async () => {
          const newCategory = await createCategory();
          const res = await supertest(app).get(
            `/api/v1/categories/${newCategory._id}`,
          );
          expect(res.status).toBe(200);
          expect(res.body.data).toHaveProperty('name', newCategory.name);
        });
      });
      describe('with invalid id', () => {
        it('should return 400 Bad Request', async () => {
          const res = await supertest(app).get('/api/v1/categories/invalidId');
          expect(res.status).toBe(400);
          expect(res.body.message).toMatch('Invalid category id');
        });
      });
      describe('with non-existing id', () => {
        it('should return 404 Not Found', async () => {
          const res = await supertest(app).get(
            '/api/v1/categories/646f3b0c4d5e8a3d4c8b4567',
          );
          expect(res.status).toBe(404);
          expect(res.body.message).toBe(
            'No document with this ID 646f3b0c4d5e8a3d4c8b4567',
          );
        });
      });
    });

    describe('PATCH', () => {
      describe('with valid id', () => {
        it('should update the category', async () => {
          const newCategory = await createCategory();
          const res = await supertest(app)
            .patch(`/api/v1/categories/${newCategory._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: 'Men',
              genders: ['men'],
            });
          expect(res.status).toBe(200);
          expect(res.body.data).toHaveProperty('name', 'Men');
        });
      });

      describe('with invalid id', () => {
        it('should return 400 Bad Request', async () => {
          const res = await supertest(app)
            .patch('/api/v1/categories/invalidId')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: 'Updated Product',
              genders: ['men'],
            });
          expect(res.status).toBe(400);
          expect(res.body.message).toMatch('Invalid category id');
        });
      });

      describe('with non-existing id', () => {
        it('should return 404 Not Found', async () => {
          const res = await supertest(app)
            .patch('/api/v1/categories/646f3b0c4d5e8a3d4c8b4567')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: 'Updated Product',
              genders: ['men'],
            });
          expect(res.status).toBe(404);
          expect(res.body.message).toBe(
            'No document with this ID 646f3b0c4d5e8a3d4c8b4567',
          );
        });
      });

      describe('with regular user token', () => {
        it('should return 403 Forbidden', async () => {
          const regularUser = await createRegularUser();
          userToken = createJWTToken(regularUser._id);

          const newCategory = await createCategory();
          const res = await supertest(app)
            .patch(`/api/v1/categories/${newCategory._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              name: 'Updated Product',
              genders: ['men'],
            });
          expect(res.status).toBe(403);
          expect(res.body.message).toBe(
            'you do not have permission to perform this action',
          );
        });
      });

      describe('with missing token', () => {
        it('should return 401 Unauthorized', async () => {
          const newCategory = await createCategory();
          const res = await supertest(app)
            .patch(`/api/v1/categories/${newCategory._id}`)
            .send({
              name: 'Updated Product',
              genders: ['men'],
            });
          expect(res.status).toBe(401);
          expect(res.body.message).toBe(
            'You are not logged in. Please log in to get access.',
          );
        });
      });
    });

    describe('DELETE', () => {
      describe('with valid id', () => {
        it('should delete the category', async () => {
          const newCategory = await createCategory();
          const res = await supertest(app)
            .delete(`/api/v1/categories/${newCategory._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
          expect(res.status).toBe(204);
        });
      });

      describe('with invalid id', () => {
        it('should return 400 Bad Request', async () => {
          const res = await supertest(app)
            .delete('/api/v1/categories/invalidId')
            .set('Authorization', `Bearer ${adminToken}`);
          expect(res.status).toBe(400);
          expect(res.body.message).toMatch('Invalid category id');
        });
      });

      describe('with non-existing id', () => {
        it('should return 404 Not Found', async () => {
          const res = await supertest(app)
            .delete('/api/v1/categories/646f3b0c4d5e8a3d4c8b4567')
            .set('Authorization', `Bearer ${adminToken}`);
          expect(res.status).toBe(404);
          expect(res.body.message).toBe(
            'No document with this ID 646f3b0c4d5e8a3d4c8b4567',
          );
        });
      });

      describe('with regular user token', () => {
        it('should return 403 Forbidden', async () => {
          const regularUser = await createRegularUser();
          userToken = createJWTToken(regularUser._id);

          const newCategory = await createCategory();
          const res = await supertest(app)
            .delete(`/api/v1/categories/${newCategory._id}`)
            .set('Authorization', `Bearer ${userToken}`);

          expect(res.status).toBe(403);
          expect(res.body.message).toBe(
            'you do not have permission to perform this action',
          );
        });
      });

      describe('with missing token', () => {
        it('should return 401 Unauthorized', async () => {
          const newCategory = await createCategory();

          const res = await supertest(app).delete(
            `/api/v1/categories/${newCategory._id}`,
          );
          expect(res.status).toBe(401);
          expect(res.body.message).toBe(
            'You are not logged in. Please log in to get access.',
          );
        });
      });
    });
  });
});
