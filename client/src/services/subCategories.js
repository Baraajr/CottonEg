import api from './api';

const URL = '/subcategories';

//GET all subcategories
export const getSubCategories = async (gender = '', category = '') => {
  try {
    const params = new URLSearchParams();
    params.append('limit', '50');

    const allowedGenders = ['men', 'women', 'kids'];

    if (allowedGenders.includes(gender)) {
      params.append('genders', gender);
    }

    if (category) {
      params.append('category', category);
    }

    const { data } = await api.get(`${URL}?${params.toString()}`);

    return data?.data ?? [];
  } catch (err) {
    console.error('getSubCategories error:', err);
    return [];
  }
};

// CREATE subcategory
export async function createSubCategory(subCategoryData) {
  try {
    const { data } = await api.post(URL, subCategoryData);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to create subcategory');
  }
}

// UPDATE subcategory
export async function updateSubCategory({ id, name, category, genders }) {
  try {
    const { data } = await api.patch(`${URL}/${id}`, {
      name,
      category,
      genders,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to update subcategory');
  }
}

// DELETE subcategory
export async function deleteSubCategory(id) {
  try {
    await api.delete(`${URL}/${id}`);
    return null;
  } catch (err) {
    throw new Error(err.message || 'Failed to delete subcategory');
  }
}
