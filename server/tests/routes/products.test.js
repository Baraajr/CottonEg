const supertest = require('supertest');
const app = require('../../app');
const {
  createAdminUser,
  createJWTToken,
  createCategory,
  createSubcategory,
  createRegularUser,
  createProduct,
} = require('../setup');

let adminToken;
let categoryId;
let subcategoryId;
let userToken;
let product;

beforeEach(async () => {
  const adminUser = await createAdminUser();
  adminToken = createJWTToken(adminUser._id);

  const category = await createCategory();
  categoryId = category._id;

  const subcategory = await createSubcategory(categoryId);
  subcategoryId = subcategory._id;
});

describe('Testing Products routes ', () => {
  describe('/api/v1/products', () => {
    describe('GET', () => {
      it('should return an array of products', async () => {
        const res = await supertest(app).get('/api/v1/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBeTruthy();
      });
    });

    describe('GET with pagination', () => {
      it('should return paginated products', async () => {
        const res = await supertest(app).get('/api/v1/products?page=1&limit=5');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body).toHaveProperty('paginationResult');
        expect(res.body.paginationResult).toHaveProperty('currentPage', 1);
        expect(res.body.paginationResult).toHaveProperty('limit', 5);
        expect(res.body.paginationResult).toHaveProperty('numberOfPages');
      });
    });

    describe('POST', () => {
      describe('without a login token', () => {
        it('should return 401 Unauthorized', async () => {
          const res = await supertest(app).post('/api/v1/products').send({
            name: 'Test Product 2',
            price: 200,
            description: 'Test product description 2',
            category: categoryId,
            quantity: 5,
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
            .post('/api/v1/products')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              name: 'Test Product 2',
              price: 200,
              description: 'Test product description 2',
              category: categoryId,
              quantity: 5,
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
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'Test Product 2',
                price: 200,
                description: 'Test product description 2',
                category: categoryId,
                subcategory: subcategoryId,
                gender: 'men',
                variants: [
                  {
                    size: 'M',
                    color: {
                      name: 'Black',
                      hex: '#000000',
                    },
                    quantity: 5,
                  },
                ],
                imageCover: 'Test Image Cover',
              });

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('name', 'Test Product 2');
            expect(res.body.data).toHaveProperty('price', 200);
          });
        });

        describe('with missing name', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                gender: 'men',
                price: 200,
                description: 'Test product description 2',
                quantity: 5,
                imageCover: 'Test Image Cover',
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Product name is required');
          });
        });

        describe('with missing Varients', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'Test Product 2',
                price: 200,
                description: 'Test product description 2',
                imageCover: 'Test Image Cover',
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Product variants are required');
          });
        });

        describe('with missing price', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'Test Product 2',
                description: 'Test product description 2',
                quantity: 5,
                imageCover: 'Test Image Cover',
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Product price is required');
          });
        });

        describe('with missing description', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'Test Product 2',
                price: 200,
                quantity: 5,
                imageCover: 'Test Image Cover',
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain(
              'Product description is required',
            );
          });
        });

        describe('with missing category', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'Test Product 2',
                price: 200,
                description: 'Test product description 2',
                quantity: 5,
                imageCover: 'Test Image Cover',
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain(
              'Product must belong to a category',
            );
          });
        });

        describe('with invalid category', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'Test Product 2',
                price: 200,
                description: 'Test product description 2',
                category: 'invalidCategoryId',
                quantity: 5,
                imageCover: 'Test Image Cover',
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Invalid category ID format');
          });
        });

        describe('with non exsiting category', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                name: 'Test Product 2',
                price: 200,
                description: 'Test product description 2',
                category: '646f3b0c4d5e8a3d4c8b4567',
                quantity: 5,
                imageCover: 'Test Image Cover',
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain(
              'No category for this id: 646f3b0c4d5e8a3d4c8b4567',
            );
          });
        });

        describe('with invalid price', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                gender: 'men',
                variants: [
                  {
                    size: 'M',
                    color: {
                      name: 'Black',
                      hex: '#000000',
                    },
                    quantity: 5,
                  },
                ],
                name: 'Test Product 2',
                price: 'invalidPrice',
                description: 'Test product description 2',
                category: categoryId,
                quantity: 5,
                imageCover: 'Test Image Cover',
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain(
              'Product price must be a number',
            );
          });
        });

        describe('with negative price', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                gender: 'men',
                variants: [
                  {
                    size: 'M',
                    color: {
                      name: 'Black',
                      hex: '#000000',
                    },
                    quantity: 5,
                  },
                ],
                name: 'Test Product 2',
                price: -200,
                description: 'Test product description 2',
                category: categoryId,
                quantity: 5,
                imageCover: 'Test Image Cover',
              });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain(
              'Product price must be greater than or equal to 0',
            );
          });
        });

        describe('with non-existing subcategory', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                gender: 'men',
                variants: [
                  {
                    size: 'M',
                    color: {
                      name: 'Black',
                      hex: '#000000',
                    },
                    quantity: 5,
                  },
                ],
                name: 'Test Product 2',
                price: 200,
                description: 'Test product description 2',
                category: categoryId,
                quantity: 5,
                imageCover: 'Test Image Cover',
                subcategory: '646f3b0c4d5e8a3d4c8b4567',
              });

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch('Subcategory does not exist.');
          });
        });

        describe('with invalid subcategory', () => {
          it('should return 400 Bad Request', async () => {
            const res = await supertest(app)
              .post('/api/v1/products')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                gender: 'men',
                variants: [
                  {
                    size: 'M',
                    color: {
                      name: 'Black',
                      hex: '#000000',
                    },
                    quantity: 5,
                  },
                ],
                imageCover: 'Test Image Cover',
                name: 'Test Product 2',
                price: 200,
                description: 'Test product description 2',
                category: categoryId,
                quantity: 5,
                subcategory: 'invalidSubcategoryId',
              });

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch('Invalid subcategory id');
          });
        });
      });
    });
  });

  describe('/api/v1/products/:id', () => {
    describe('GET', () => {
      describe('with valid id', () => {
        it('should return a single product', async () => {
          product = await createProduct(categoryId, subcategoryId);
          const res = await supertest(app).get(
            `/api/v1/products/${product._id}`,
          );
          expect(res.status).toBe(200);
          expect(res.body.data).toHaveProperty('name', 'Test Product');
        });
      });
      describe('with invalid id', () => {
        it('should return 400 Bad Request', async () => {
          const res = await supertest(app).get('/api/v1/products/invalidId');
          expect(res.status).toBe(400);
          expect(res.body.message).toMatch('Invalid product ID format');
        });
      });
      describe('with non-existing id', () => {
        it('should return 404 Not Found', async () => {
          const res = await supertest(app).get(
            '/api/v1/products/646f3b0c4d5e8a3d4c8b4567',
          );
          expect(res.status).toBe(404);
          expect(res.body.message).toBe(
            'No document with this ID 646f3b0c4d5e8a3d4c8b4567',
          );
        });
      });
    });

    describe('PATCH /api/v1/products/:id', () => {
      describe('valid updates', () => {
        it('should update basic product fields', async () => {
          product = await createProduct(categoryId, subcategoryId);

          const res = await supertest(app)
            .patch(`/api/v1/products/${product._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: 'Updated Product',
              price: 300,
              description:
                'Updated product description long enough to pass validation.',
            });

          expect(res.status).toBe(200);
          expect(res.body.data.name).toBe('Updated Product');
          expect(res.body.data.price).toBe(300);
        });

        it('should partially update only provided fields', async () => {
          product = await createProduct(categoryId, subcategoryId);

          const res = await supertest(app)
            .patch(`/api/v1/products/${product._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: 'Only Name Updated',
            });

          expect(res.status).toBe(200);
          expect(res.body.data.name).toBe('Only Name Updated');
          expect(res.body.data.description).toBe(product.description);
        });
      });

      describe('variants', () => {
        describe('POST /:id/addVariant', () => {
          it('should add a new variant', async () => {
            product = await createProduct(categoryId, subcategoryId, {
              variants: [
                {
                  size: 'M',
                  color: { name: 'Black', hex: '#000000' },
                  quantity: 10,
                },
              ],
            });

            const res = await supertest(app)
              .post(`/api/v1/products/${product._id}/addVariant`)
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                size: 'L',
                color: { name: 'Red', hex: '#ff0000' },
                quantity: 5,
              });

            expect(res.status).toBe(201);
            expect(res.body.data.variant.size).toBe('L');
            expect(res.body.data.variant.color.name).toBe('Red');
            expect(res.body.data.variant.quantity).toBe(5);
          });
        });

        describe('PATCH /:id/editVariant/:variantId', () => {
          it('should edit a variant', async () => {
            product = await createProduct(categoryId, subcategoryId);

            const variantId = product.variants[0]._id;

            const res = await supertest(app)
              .patch(`/api/v1/products/${product._id}/editVariant/${variantId}`)
              .set('Authorization', `Bearer ${adminToken}`)
              .send({
                quantity: 25,
              });

            expect(res.status).toBe(200);
            expect(res.body.data.variant.quantity).toBe(25);
          });
        });

        describe('DELETE /:id/deleteVariant/:variantId', () => {
          it('should delete a variant', async () => {
            product = await createProduct(categoryId, subcategoryId, {
              variants: [
                {
                  size: 'M',
                  color: { name: 'Black', hex: '#000000' },
                  quantity: 10,
                },
                {
                  size: 'L',
                  color: { name: 'Red', hex: '#ff0000' },
                  quantity: 5,
                },
              ],
            });

            const variantId = product.variants[0]._id;

            const res = await supertest(app)
              .delete(
                `/api/v1/products/${product._id}/deleteVariant/${variantId}`,
              )
              .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(204);
          });
        });
      });

      describe('images', () => {
        describe('POST /:id/addImage', () => {
          it('should add an image', async () => {
            product = await createProduct(categoryId, subcategoryId);

            const res = await supertest(app)
              .post(`/api/v1/products/${product._id}/addImage`)
              .set('Authorization', `Bearer ${adminToken}`)
              .send({ addImage: 'ixtures/test-image.jpg' });

            expect(res.status).toBe(201);
            expect(res.body.data.image).toBeDefined();
            expect(res.body.data.image.url).toBeDefined();
          });
        });

        describe('DELETE /:id/deleteImage/:imageId', () => {
          it('should delete an image', async () => {
            product = await createProduct(categoryId, subcategoryId, {
              images: [{ url: 'https://test.com/img1.jpg' }],
            });

            const imageId = product.images[0]._id;

            const res = await supertest(app)
              .delete(`/api/v1/products/${product._id}/deleteImage/${imageId}`)
              .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(204);
          });
        });
      });

      describe('auth', () => {
        it('should reject missing token', async () => {
          product = await createProduct(categoryId, subcategoryId);

          const res = await supertest(app)
            .patch(`/api/v1/products/${product._id}`)
            .send({ name: 'X' });

          expect(res.status).toBe(401);
        });

        it('should reject regular user', async () => {
          product = await createProduct(categoryId, subcategoryId);
          const user = await createRegularUser();

          const res = await supertest(app)
            .patch(`/api/v1/products/${product._id}`)
            .set('Authorization', `Bearer ${createJWTToken(user._id)}`)
            .send({ name: 'X' });

          expect(res.status).toBe(403);
        });
      });

      describe('invalid cases', () => {
        it('should return 400 for invalid id', async () => {
          const res = await supertest(app)
            .patch('/api/v1/products/invalidId')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'X' });

          expect(res.status).toBe(400);
        });

        it('should return 404 for non-existing product', async () => {
          const res = await supertest(app)
            .patch('/api/v1/products/646f3b0c4d5e8a3d4c8b4567')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'X' });

          expect(res.status).toBe(404);
        });
      });
    });

    describe('DELETE', () => {
      describe('with valid id', () => {
        it('should delete the product', async () => {
          product = await createProduct(categoryId, subcategoryId);
          const res = await supertest(app)
            .delete(`/api/v1/products/${product._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
          expect(res.status).toBe(204);
        });
      });

      describe('with invalid id', () => {
        it('should return 400 Bad Request', async () => {
          const res = await supertest(app)
            .delete('/api/v1/products/invalidId')
            .set('Authorization', `Bearer ${adminToken}`);
          expect(res.status).toBe(400);
          expect(res.body.message).toMatch('Invalid product ID format');
        });
      });

      describe('with non-existing id', () => {
        it('should return 404 Not Found', async () => {
          const res = await supertest(app)
            .delete('/api/v1/products/646f3b0c4d5e8a3d4c8b4567')
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
            .delete(`/api/v1/products/${product._id}`)
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
            `/api/v1/products/${product._id}`,
          );
          expect(res.status).toBe(401);
          expect(res.body.message).toBe(
            'You are not logged in. Please log in to get access.',
          );
        });
      });
    });
  });

  describe('get /api/v1/products/search', () => {
    describe('with valid search text', () => {
      it('should return an array of products', async () => {
        await createProduct(categoryId, subcategoryId);
        const res = await supertest(app)
          .post('/api/v1/products/search')
          .send({ text: 'Test' });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBeTruthy();
      });
    });

    describe('with empty search text', () => {
      it('should return 400 Bad Request', async () => {
        const res = await supertest(app)
          .post('/api/v1/products/search')
          .send({ text: '' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Search text is required');
      });
    });
  });

  describe('get /api/v1/products/:id/reviews', () => {
    describe('Get', () => {
      it('should return 200 OK', async () => {
        product = await createProduct(categoryId, subcategoryId);
        const res = await supertest(app).get(
          `/api/v1/products/${product._id}/reviews`,
        );
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(Array.isArray(res.body.data)).toBeTruthy();
      });
    });
    describe('with invalid id', () => {
      it('should return 400 Bad Request', async () => {
        const res = await supertest(app).get(
          '/api/v1/products/invalidId/reviews',
        );
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Invalid product ID format');
      });
    });

    describe('with non-existing id', () => {
      it('should return 404 Not Found', async () => {
        const res = await supertest(app).get(
          '/api/v1/products/646f3b0c4d5e8a3d4c8b4567/reviews',
        );
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(
          'No product with this id 646f3b0c4d5e8a3d4c8b4567',
        );
      });
    });
  });

  describe('post /api/v1/products/:id/reviews', () => {
    describe('Post', () => {
      describe('with user token', () => {
        it('should return 201 Created', async () => {
          const regularUser = await createRegularUser();
          userToken = createJWTToken(regularUser._id);

          product = await createProduct(categoryId, subcategoryId);
          const res = await supertest(app)
            .post(`/api/v1/products/${product._id}/reviews`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              title: 'Great product!',
              ratings: 4.5,
            });

          expect(res.status).toBe(201);
          expect(res.body.status).toBe('success');
          expect(res.body.data.title).toBe('Great product!');
          expect(res.body.data.ratings).toBe(4.5);
          expect(res.body.data.product.toString()).toBe(product._id.toString());
        });
      });

      describe('with missing token', () => {
        it('should return 401 Unauthorized', async () => {
          product = await createProduct(categoryId, subcategoryId);
          const res = await supertest(app).post(
            `/api/v1/products/${product._id}/reviews`,
          );
          // expect(res.status).toBe(401);
          expect(res.body.message).toBe(
            'You are not logged in. Please log in to get access.',
          );
        });
      });
    });
  });
});
