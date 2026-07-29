import api from './api';

const CATEGORY_URL = '/categories';

export const getCategories = async (gender) => {
  const params = new URLSearchParams();
  params.append('limit', '50');

  const allowedGenders = ['men', 'women', 'kids'];

  if (allowedGenders.includes(gender)) {
    params.append('genders', gender);
  }
  try {
    const { data } = await api.get(`${CATEGORY_URL}?${params.toString()}`);
    console.log('data.data', data.data);
    return data.data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch categories');
  }
};

export async function createCategory(categoryData) {
  try {
    const { data } = await api.post(CATEGORY_URL, categoryData);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to create category');
  }
}

export async function deleteCategory(categoryId) {
  try {
    await api.delete(`${CATEGORY_URL}/${categoryId}`);
    return null;
  } catch (err) {
    throw new Error(err.message || 'Failed to delete category');
  }
}

export async function updateCategory({ id, name, genders }) {
  try {
    const { data } = await api.patch(`${CATEGORY_URL}/${id}`, {
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
    const { data } = await api.get(`${CATEGORY_URL}/by-gender/${gender}`);
    return data.data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch categories');
  }
}
