const supertest = require('supertest');
const app = require('../../app');
const { createReqularUser } = require('../setup');

// mock the sendEmail function
jest.mock('../../utils/sendEmail', () =>
  jest.fn().mockImplementation(() => Promise.resolve(true)),
);

describe('Auth Routes', () => {
  describe('POST /api/v1/auth/signup', () => {
    describe('with valid data', () => {
      it('should return 200 and create a new user', async () => {
        const res = await supertest(app).post('/api/v1/auth/signup').send({
          name: 'test',
          email: 'unique@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        });

        expect(res.status).toBe(201);
        expect(res.body.status).toBe('success');

        expect(res.body.message).toMatch(
          'User created. Please check your email for the verification code',
        );
      });
    });

    describe('with short name', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/signup').send({
          name: 'Jo',
          email: 'johndoe1@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toBe('Too short User name');
      });
    });

    describe('with invalid email', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/signup').send({
          name: 'John Doe',
          email: 'johndoe@gmail',
          password: 'test1234',
          passwordConfirm: 'test1234',
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid email address');
      });
    });

    describe('with existing email', () => {
      it('should return 400 and an error message', async () => {
        await createReqularUser({
          name: 'Jane Doe',
          email: 'johndoe@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        });

        const res = await supertest(app).post('/api/v1/auth/signup').send({
          name: 'John Doe',
          email: 'johndoe@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('E-mail already in use');
      });
    });

    describe('with short password', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/signup').send({
          name: 'John Doe',
          email: 'johndoe1@mail.com',
          password: 'test',
          passwordConfirm: 'test',
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Password must be at least 8 characters');
      });
    });

    describe('with non-matching passwords', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/signup').send({
          name: 'John Doe',
          email: 'johndoe1@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test12345',
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Passwords don't match");
      });
    });

    describe('with missing name', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/signup').send({
          email: 'johndoe1@gmail.com',
          paswword: 'test1234',
          passwordConfirm: 'test1234',
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Name is required');
        expect(res.body.message).toContain('Too short User name');
      });
    });

    describe('with missing email', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/signup').send({
          name: 'John Doe',
          password: 'test1234',
          passwordConfirm: 'test1234',
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Email required');
      });
    });

    describe('with missing password', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/signup').send({
          name: 'John Doe',
          email: 'johndoe1@gmail.com',
          passwordConfirm: 'test1234',
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Password is required/i);
      });
    });

    describe('with missing password confirmation', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/signup').send({
          name: 'John Doe',
          email: 'johndoe1@mail.com',
          password: 'test1234',
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Password confirmation is required/i);
      });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    describe('with valid credentials', () => {
      it('should return 200 and a token', async () => {
        await createReqularUser({
          name: 'Jane Doe',
          email: 'johndoe@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        });

        const res = await supertest(app).post('/api/v1/auth/login').send({
          email: 'johndoe@gmail.com',
          password: 'test1234',
        });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.token).toBeDefined();
        expect(res.body.user).toBeDefined();
      });
    });

    describe('with invalid email', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/login').send({
          email: 'johndoe@gmail',
          password: 'test1234',
        });
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/Incorrect email or password/i);
      });
    });

    describe('with non-existing email', () => {
      it('should return 401 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/login').send({
          email: 'nonexisting@gmail.com',
          password: 'test1234',
        });
        expect(res.status).toBe(401);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toMatch(/Incorrect email or password/i);
      });
    });

    describe('with incorrect password', () => {
      it('should return 401 and an error message', async () => {
        const res = await supertest(app).post('/api/v1/auth/login').send({
          email: 'johndoe@gmail.com',
          password: 'wrongpassword',
        });
        expect(res.status).toBe(401);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toMatch(/Incorrect email or password/i);
      });
    });
  });

  describe('GET /api/v1/auth/logout', () => {
    it('should return 200 and log the user out', async () => {
      const res = await supertest(app).get('/api/v1/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Logged out successfully');
    });
  });

  describe('POST /api/v1/auth/forgotpassword', () => {
    describe('with valid email', () => {
      it('should return 200', async () => {
        await createReqularUser({
          name: 'Jane Doe',
          email: 'johndoe@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        });

        const res = await supertest(app)
          .post('/api/v1/auth/forgotpassword')
          .send({
            email: 'johndoe@gmail.com',
          });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toMatch(/Reset code sent to your email!/i);
      });
    });

    describe('with non-existing email', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app)
          .post('/api/v1/auth/forgotpassword')
          .send({
            email: 'nonexisting@gmail.com',
          });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toMatch(/Incorrect email/i);
      });
    });

    describe('with missing email', () => {
      it('should return 400 and an error message', async () => {
        const res = await supertest(app)
          .post('/api/v1/auth/forgotpassword')
          .send({});
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toMatch(/Please enter your email/i);
      });
    });
  });

  // the verfiy reset code route and the reset password route are not tested yet
});
