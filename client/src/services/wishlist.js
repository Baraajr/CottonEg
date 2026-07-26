import api from './api';

const URL = '/wishlist';

export const getLoggedUserWishlist = async () => {
  try {
    const { data } = await api.get(URL);

    return data;
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    throw err;
  }
};

export const addProductToWishlist = async (productId) => {
  try {
    const { data } = await api.post(URL, {
      productId,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to add to wishlist');
  }
};

export const removeItemFromWishlist = async (productId) => {
  try {
    const { data } = await api.delete(`${URL}/${productId}`);

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to remove product');
  }
};
