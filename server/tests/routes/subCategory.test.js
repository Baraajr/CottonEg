const supertest = require('supertest');
const app = require('../../app');
const {
  createAdminUser,
  createJWTToken,
  createCategory,
  createSubcategory,
  createRegularUser,
} = require('../setup');

let categoryId;
let adminToken;
let userToken;

beforeEach(async () => {
  const adminUser = await createAdminUser();
  adminToken = createJWTToken(adminUser._id);

  const category = await createCategory();
  categoryId = category._id;
});

describe('Testing subcategory routes ', () => {
  describe('/api/v1/subcategories', () => {
    describe('GET', () => {
      it('should return an array of subcategories', async () => {
        const res = await supertest(app).get('/api/v1/subcategories');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBeTruthy();
      });
    });

    describe('POST', () => {
      describe('without a login token', () => {
        it('should return 401 Unauthorized', async () => {
          const res = await supertest(app).post('/api/v1/subcategories').send({
            name: 'test subcategory',
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
            .post('/api/v1/subcategories')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              name: 'test subcategory',
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
              .post('/api/v1/subcategories')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'test subcategory',
                categoryId,
                genders: ['men'],
              });

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('name', 'test subcategory');
          });
        });

        describe('with missing name', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/subcategories')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                category: categoryId,
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain(
              'Please provide subcategory name',
            );
          });
        });

        describe('with short name', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/subcategories')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'a',
                categoryId,
                genders: ['men'],
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain(
              'Invalid input data. too short subcategory name',
            );
          });
        });
      });
    });
  });

  describe('/api/v1/subcategories/:id', () => {
    describe('GET', () => {
      describe('with valid id', () => {
        it('should return a single subcategory', async () => {
          const newsubcategory = await createSubcategory(categoryId);
          const res = await supertest(app).get(
            `/api/v1/subcategories/${newsubcategory._id}`,
          );
          expect(res.status).toBe(200);
          expect(res.body.data).toHaveProperty('name', 'test subcategory');
        });
      });
      describe('with invalid id', () => {
        it('should return 400 Bad Request', async () => {
          const res = await supertest(app).get(
            '/api/v1/subcategories/invalidId',
          );
          expect(res.status).toBe(400);
          expect(res.body.message).toMatch('Invalid subcategory id');
        });
      });
      describe('with non-existing id', () => {
        it('should return 404 Not Found', async () => {
          const res = await supertest(app).get(
            '/api/v1/subcategories/646f3b0c4d5e8a3d4c8b4567',
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
        it('should update the subcategory', async () => {
          const newsubcategory = await createSubcategory(categoryId);
          const res = await supertest(app)
            .patch(`/api/v1/subcategories/${newsubcategory._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: 'Updated subcategory',
            });
          expect(res.status).toBe(200);
          expect(res.body.data).toHaveProperty('name', 'Updated subcategory');
        });
      });

      describe('with invalid id', () => {
        it('should return 400 Bad Request', async () => {
          const res = await supertest(app)
            .patch('/api/v1/subcategories/invalidId')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: 'Updated subcategory',
            });
          expect(res.status).toBe(400);
          expect(res.body.message).toMatch('Invalid subcategory id');
        });
      });

      describe('with non-existing id', () => {
        it('should return 404 Not Found', async () => {
          const res = await supertest(app)
            .patch('/api/v1/subcategories/646f3b0c4d5e8a3d4c8b4567')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: 'Updated subcategory',
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

          const res = await supertest(app)
            .patch(`/api/v1/subcategories/646f3b0c4d5e8a3d4c8b4567`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              name: 'Updated subSategory',
            });
          expect(res.status).toBe(403);
          expect(res.body.message).toBe(
            'you do not have permission to perform this action',
          );
        });
      });

      describe('with missing token', () => {
        it('should return 401 Unauthorized', async () => {
          const res = await supertest(app)
            .patch(`/api/v1/subcategories/646f3b0c4d5e8a3d4c8b4567`)
            .send({
              name: 'Updated subcategory',
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
        it('should delete the subcategory', async () => {
          const newsubcategory = await createSubcategory(categoryId);
          const res = await supertest(app)
            .delete(`/api/v1/subcategories/${newsubcategory._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
          expect(res.status).toBe(204);
        });
      });

      describe('with invalid id', () => {
        it('should return 400 Bad Request', async () => {
          const res = await supertest(app)
            .delete('/api/v1/subcategories/invalidId')
            .set('Authorization', `Bearer ${adminToken}`);
          expect(res.status).toBe(400);
          expect(res.body.message).toMatch('Invalid subcategory id');
        });
      });

      describe('with non-existing id', () => {
        it('should return 404 Not Found', async () => {
          const res = await supertest(app)
            .delete('/api/v1/subcategories/646f3b0c4d5e8a3d4c8b4567')
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

          const res = await supertest(app)
            .delete(`/api/v1/subcategories/$646f3b0c4d5e8a3d4c8b4567`)
            .set('Authorization', `Bearer ${userToken}`);
          expect(res.status).toBe(403);
          expect(res.body.message).toBe(
            'you do not have permission to perform this action',
          );
        });
      });

      describe('with missing token', () => {
        it('should return 401 Unauthorized', async () => {
          const res = await supertest(app).delete(
            `/api/v1/subcategories/$646f3b0c4d5e8a3d4c8b4567`,
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
