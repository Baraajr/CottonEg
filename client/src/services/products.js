import api from './api';

const PRODUCTS_URL = '/products';

export async function getFilteredProducts({
  category,
  subcategory,
  minPrice,
  maxPrice,
  page,
  sort,
  search,
  gender,
  limit = 20,
  featured,
  stock,
  size,
  color,
} = {}) {
  const params = new URLSearchParams();

  if (sort) {
    const [field, order] = sort.split('-');
    params.append('sort', order === 'asc' ? field : `-${field}`);
  }

  if (category && category != 'all') params.append('category', category);
  if (subcategory && subcategory !== 'all')
    params.append('subcategory', subcategory);
  if (minPrice !== undefined) params.append('price[gte]', minPrice);
  if (maxPrice !== undefined) params.append('price[lte]', maxPrice);
  if (page !== undefined) params.append('page', page);
  if (gender && gender !== 'all') params.append('gender', gender);
  if (limit !== undefined) params.append('limit', limit);
  if (featured && featured != 'all') params.append('featured', featured);
  if (size && size != 'all') params.append('size', size);
  if (color && color != 'all') params.append('color', color);
  if (stock && stock !== 'all') {
    if (stock === 'inStock') {
      params.append('quantity[gt]', '0');
    } else if (stock === 'outOfStock') {
      params.append('quantity', '0');
    }
  }
  if (search) params.append('search', search);

  try {
    const { data } = await api.get(`${PRODUCTS_URL}?${params.toString()}`);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch products');
  }
}

export async function getProduct(productId) {
  try {
    const { data } = await api.get(`${PRODUCTS_URL}/${productId}`);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch product');
  }
}

export async function createProduct(formData) {
  try {
    const { data } = await api.post(PRODUCTS_URL, formData);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to create product');
  }
}

export async function updateProduct({ id, data }) {
  try {
    const { data: result } = await api.patch(
      `${PRODUCTS_URL}/${id}`,
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
    throw new Error(err.message || 'Failed to update product');
  }
}

// --------------------
// VARIANTS
// --------------------
export async function addVariant({ id, data }) {
  try {
    const { data: result } = await api.post(
      `${PRODUCTS_URL}/${id}/addVariant`,
      data,
    );

    return result;
  } catch (err) {
    throw new Error(err.message || 'Failed to add variant');
  }
}

export async function editVariant({ id, variantId, data }) {
  try {
    const { data: result } = await api.patch(
      `${PRODUCTS_URL}/${id}/editVariant/${variantId}`,
      data,
    );

    return result;
  } catch (err) {
    throw new Error(err.message || 'Failed to edit variant');
  }
}

export async function deleteVariant({ id, variantId }) {
  try {
    await api.delete(`${PRODUCTS_URL}/${id}/deleteVariant/${variantId}`);
    return true; // no JSON expected
  } catch (err) {
    throw new Error(err.message || 'Failed to delete variant');
  }
}

// --------------------
// IMAGES
// --------------------
export async function addImage({ id, data }) {
  try {
    const { data: result } = await api.post(
      `${PRODUCTS_URL}/${id}/addImage`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return result;
  } catch (err) {
    throw new Error(err.message || 'Failed to add image');
  }
}

export async function deleteImage({ id, imageId }) {
  try {
    await api.delete(`${PRODUCTS_URL}/${id}/deleteImage/${imageId}`);
    return true; // no JSON expected
  } catch (err) {
    throw new Error(err.message || 'Failed to delete image');
  }
}

export async function deleteProduct(productId) {
  try {
    await api.delete(`${PRODUCTS_URL}/${productId}`);
    return null; // 204 No Content
  } catch (err) {
    throw new Error(err.message || 'Failed to remove product');
  }
}

export async function searchProducts(text) {
  try {
    const { data } = await api.post(`${PRODUCTS_URL}/search`, {
      text,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to search');
  }
}

export const createProductReview = async (productId, data) => {
  const response = await api.post(
    `${PRODUCTS_URL}/${productId}/reviews/`,
    data,
  );

  return response.data;
};
