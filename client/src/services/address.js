import api from './api';

const ADDRESS_URL = '/addresses';

export const getUserAddresses = async () => {
  try {
    const { data } = await api.get(ADDRESS_URL);
    return data.data;
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch addresses');
  }
};

export const addAddress = async ({
  alias,
  details,
  city,
  phone,
  postalCode,
}) => {
  try {
    const { data } = await api.post(ADDRESS_URL, {
      alias,
      details,
      city,
      phone,
      postalCode,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Failed to add address');
  }
};

export const removeAddress = async (addressId) => {
  try {
    await api.delete(`${ADDRESS_URL}/${addressId}`);
    return null; // 204 No Content
  } catch (err) {
    throw new Error(err.message || 'Failed to remove address');
  }
};
