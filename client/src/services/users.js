import api from './api';

const USERS_URL = '/users';

export const getLoggedUser = async () => {
  try {
    const { data } = await api.get(`${USERS_URL}/getMe`);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Not logged in');
  }
};

export const updatePassword = async ({
  currentPassword,
  newPassword,
  passwordConfirm,
}) => {
  try {
    const { data } = await api.patch(`${USERS_URL}/changeMyPassword`, {
      currentPassword,
      newPassword,
      passwordConfirm,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to update password');
  }
};

export const updateUser = async (data) => {
  try {
    const { data: result } = await api.patch(
      `${USERS_URL}/updateMe`,
      data,
      data instanceof FormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined,
    );

    return result;
  } catch (err) {
    throw new Error(err.message || 'Failed to update profile');
  }
};

export const getAllUsers = async () => {
  try {
    const { data } = await api.get(USERS_URL);
    return data.data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch users');
  }
};

export async function activateUser(id) {
  try {
    const { data } = await api.patch(`${USERS_URL}/${id}/activate`);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to update user');
  }
}

export async function makeUserAdmin(id) {
  try {
    const { data } = await api.patch(`${USERS_URL}/${id}/updateRole`, {
      role: 'admin',
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to update role');
  }
}
