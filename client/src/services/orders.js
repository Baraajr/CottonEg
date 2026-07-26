import api from './api';

const ORDERS_URL = '/orders';

export async function getOrders() {
  try {
    const { data } = await api.get(ORDERS_URL);
    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch orders');
  }
}
