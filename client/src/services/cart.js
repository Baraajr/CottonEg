import api from './api';

const CART_URL = '/cart';

/* =========================
   GET CART
========================= */
export const getLoggedUserCart = async () => {
  try {
    const { data } = await api.get(CART_URL);
    return data;
  } catch (err) {
    throw new Error(err.message || err || 'Failed to fetch cart');
  }
};

/* =========================
   ADD TO CART
   (FIXED: productId + variantId + quantity)
========================= */
export const addProductToCart = async ({
  productId,
  variantId,
  quantity = 1,
}) => {
  try {
    const { data } = await api.post(CART_URL, {
      productId,
      variantId,
      quantity,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || err || 'Failed to add to cart');
  }
};

/* =========================
   REMOVE ITEM FROM CART
========================= */
export const removeItemFromCart = async (itemId) => {
  try {
    const { data } = await api.delete(`${CART_URL}/${itemId}`);
    return data;
  } catch (err) {
    throw new Error(err.message || err || 'Failed to remove item');
  }
};

/* =========================
   UPDATE ITEM QUANTITY
========================= */
export const updateItemQuantity = async ({ itemId, quantity }) => {
  try {
    const { data } = await api.patch(`${CART_URL}/${itemId}`, {
      quantity,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || err || 'Failed to update quantity');
  }
};

/* =========================
   CLEAR CART
========================= */
export const clearUserCart = async () => {
  try {
    const { data } = await api.delete(CART_URL);
    return data;
  } catch (err) {
    if (err.status === 204) return null;
    throw new Error(err.message || err || 'Failed to clear cart');
  }
};
