import api from './api';

const CTEGORY_URL = '/categories';

export const getCategories = async () => {
  try {
    const { data } = await api.get(`${CTEGORY_URL}?limit=20`);
    return data.data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch categories');
  }
};

export async function createCategory(categoryData) {
  try {
    const { data } = await api.post(CTEGORY_URL, categoryData);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to create category');
  }
}

export async function deleteCategory(categoryId) {
  try {
    await api.delete(`${CTEGORY_URL}/${categoryId}`);
    return null;
  } catch (err) {
    throw new Error(err.message || 'Failed to delete category');
  }
}

export async function updateCategory({ id, name, genders }) {
  try {
    const { data } = await api.patch(`${CTEGORY_URL}/${id}`, {
      name,
      genders,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to update category');
  }
}

export async function getCategoriesByGender(gender) {
  try {
    const { data } = await api.get(`${CTEGORY_URL}/by-gender/${gender}`);
    return data.data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch categories');
  }
}
