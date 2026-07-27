import api from './api';

const ORDERS_URL = '/orders';

export async function getMyOrders() {
  try {
    const res = await api.get('/orders/my-orders');

    console.log('res:', res);
    console.log('data:', res.data);

    return res.data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch orders');
  }
}

export async function getAllOrders() {
  try {
    const { data } = await api.get(`${ORDERS_URL}?sort=-createdAt`);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch orders');
  }
}

export async function createCashOrder(cartId, shippingAddress) {
  try {
    const { data } = await api.post(`${ORDERS_URL}/${cartId}`, {
      shippingAddress,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to create order');
  }
}

export async function createCheckoutSession(cartId) {
  try {
    const { data } = await api.post(`${ORDERS_URL}/checkout-session/${cartId}`);

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to create checkout session');
  }
}
