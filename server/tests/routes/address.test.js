const supertest = require('supertest');
const app = require('../../app');
const { createJWTToken, createReqularUser } = require('../setup');

let user;
let token;
let addressId;

beforeEach(async () => {
  user = await createReqularUser();
  token = createJWTToken(user._id);
});

describe('Address Routes', () => {
  describe('/api/v1/addresses', () => {
    describe('GET /', () => {
      it('should return all addresses of the logged-in user', async () => {
        const res = await supertest(app)
          .get('/api/v1/addresses')
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('addresses');
      });
    });

    describe('POST /', () => {
      describe('with valid data', () => {
        it('should add a new address for the logged-in user', async () => {
          const newAddress = {
            alias: 'work',
            details: 'Egypt, menofiya, menouf, tamalay',
            phone: '01032650872',
            city: 'menouf',
            postalCode: '31734',
          };

          const res = await supertest(app)
            .post('/api/v1/addresses')
            .set('Authorization', `Bearer ${token}`)
            .send(newAddress);

          addressId = res.body.data.address[0]._id;
          expect(res.statusCode).toBe(200);
          expect(res.body.data).toHaveProperty('address');
          expect(res.body.data.address).toEqual(
            expect.arrayContaining([expect.objectContaining(newAddress)]),
          );
        });
      });

      describe('with invalid data', () => {
        it('should return a validation error ', async () => {
          const newAddress = {};
          const res = await supertest(app)
            .post('/api/v1/addresses')
            .set('Authorization', `Bearer ${token}`)
            .send(newAddress);
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain(
            'alias required, Please provide your address phone, Invalid phone number only accepted Egy and SA Phone numbers, Please provide your postal code, Please provide a valid postal code, please provide the city',
          );
        });
      });
    });

    describe('DELETE /:addressId', () => {
      it('should remove an address by ID', async () => {
        const res = await supertest(app)
          .delete(`/api/v1/addresses/${addressId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(204);
      });
    });
  });
});
