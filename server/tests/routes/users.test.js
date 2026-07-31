const supertest = require('supertest');
const app = require('../../app');
const {
  createJWTToken,
  createRegularUser,
  createAdminUser,
} = require('../setup');
const User = require('../../models/userModel');

let user;
let token;
const password = 'password12345';

beforeEach(async () => {
  user = await createRegularUser({ password });
  token = createJWTToken(user._id);
});

describe('User Routes', () => {
  describe('/api/v1/users', () => {
    describe('GET /getMe', () => {
      it('should return logged user data', async () => {
        const res = await supertest(app)
          .get('/api/v1/users/getMe')
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.email).toBe(user.email);
      });
    });

    describe('PATCH /updateMe', () => {
      it('should update logged user data', async () => {
        const updatedData = {
          name: 'Updated Name',
          phone: '01032650872',
        };

        const res = await supertest(app)
          .patch('/api/v1/users/updateMe')
          .set('Authorization', `Bearer ${token}`)
          .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.user.name).toBe(updatedData.name);
        expect(res.body.data.user.phone).toBe(updatedData.phone);
      });

      it('should prevent updating password through this route', async () => {
        const res = await supertest(app)
          .patch('/api/v1/users/updateMe')
          .set('Authorization', `Bearer ${token}`)
          .send({
            password: 'newPassword123',
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain(
          'this route is not for updating password',
        );
      });
    });

    describe('PATCH /changeMyPassword', () => {
      it('should update password successfully', async () => {
        const res = await supertest(app)
          .patch('/api/v1/users/changeMyPassword')
          .set('Authorization', `Bearer ${token}`)
          .send({
            currentPassword: password,
            newPassword: 'newPassword123',
            passwordConfirm: 'newPassword123',
          });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toContain('Password changed successfully');
      });

      it('should fail with wrong current password', async () => {
        const res = await supertest(app)
          .patch('/api/v1/users/changeMyPassword')
          .set('Authorization', `Bearer ${token}`)
          .send({
            currentPassword: 'wrongPassword',
            newPassword: 'newPassword123',
            passwordConfirm: 'newPassword123',
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain('Incorrect current password');
      });
    });

    describe('DELETE /deleteMe', () => {
      it('should deactivate logged user account', async () => {
        const res = await supertest(app)
          .delete('/api/v1/users/deleteMe')
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(204);
      });

      it('should prevent admin deleting his account', async () => {
        const admin = await createAdminUser();
        const adminToken = createJWTToken(admin._id);

        const res = await supertest(app)
          .delete('/api/v1/users/deleteMe')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain('Admin cannot delete their account');
      });
    });
  });

  describe('Admin User Routes', () => {
    let admin;
    let adminToken;

    beforeEach(async () => {
      admin = await createAdminUser();
      adminToken = createJWTToken(admin._id);
    });

    describe('GET /', () => {
      it('should return all users for admin', async () => {
        const res = await supertest(app)
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
    });

    describe('GET /:id', () => {
      it('should return user by id', async () => {
        const res = await supertest(app)
          .get(`/api/v1/users/${user._id}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('_id');
      });
    });

    describe('PATCH /:id/updateRole', () => {
      it('should update user role', async () => {
        const res = await supertest(app)
          .patch(`/api/v1/users/${user._id}/updateRole`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            role: 'admin',
          });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.user.role).toBe('admin');
      });

      it('should reject invalid role', async () => {
        const res = await supertest(app)
          .patch(`/api/v1/users/${user._id}/updateRole`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            role: 'superadmin',
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain('Invalid role specified');
      });
    });

    describe('PATCH /:id/activate', () => {
      it('should activate inactive user', async () => {
        await User.findByIdAndUpdate(user._id, {
          active: false,
        });

        const res = await supertest(app)
          .patch(`/api/v1/users/${user._id}/activate`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.user.active).toBe(true);
      });
    });
  });
});
