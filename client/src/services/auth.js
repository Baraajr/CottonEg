import api from './api';

const AUTH_URL = '/auth';

export async function signup({ email, password, passwordConfirm, name }) {
  try {
    const { data } = await api.post(`${AUTH_URL}/signup`, {
      name,
      email,
      password,
      passwordConfirm,
    });

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function login({ email, password }) {
  try {
    const { data } = await api.post(`${AUTH_URL}/login`, {
      email,
      password,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Login failed');
  }
}

export async function logout() {
  try {
    const { data } = await api.get(`${AUTH_URL}/logout`);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Logout failed');
  }
}

export async function verifyEmail({ email, code }) {
  try {
    const { data } = await api.post(`${AUTH_URL}/verify-email`, {
      email,
      code: String(code),
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Verification failed');
  }
}

export async function resendEmail(email) {
  try {
    const { data } = await api.post(`${AUTH_URL}/resend-verification-email`, {
      email,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Resend failed');
  }
}

// 1. Forgot Password (send reset code)
export async function forgotPassword(email) {
  try {
    const { data } = await api.post(`${AUTH_URL}/forgotPassword`, {
      email,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to send reset code');
  }
}

// 2. Verify Reset Code
export async function verifyResetCode({ email, resetCode }) {
  try {
    const { data } = await api.post(`${AUTH_URL}/verifyResetCode`, {
      email,
      resetCode,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Invalid reset code');
  }
}

// 3. Reset Password
export async function resetPassword({ email, newPassword, confirmPassword }) {
  try {
    const { data } = await api.patch(`${AUTH_URL}/resetPassword`, {
      email,
      newPassword,
      confirmPassword,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Password reset failed');
  }
}
