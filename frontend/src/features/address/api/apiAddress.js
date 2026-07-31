import axios from 'axios';

export async function getAllAddress() {
  const res = await axios.get('/api/v1/address', {
    withCredentials: true,
  });

  return res.data;
}

export async function getDefaultAddress() {
  const res = await axios.get('/api/v1/address/default', {
    withCredentials: true,
  });

  return res.data;
}

export async function createAddress(data) {
  const res = await axios.post('/api/v1/address', data, {
    withCredentials: true,
  });

  return res.data;
}

export async function updateDefaultAddress(id) {
  const res = await axios.put(
    `/api/v1/address/${id}/default`,
    {},
    {
      withCredentials: true,
    },
  );

  return res.data;
}

export async function updateAddress({ id, data }) {
  const res = await axios.put(`/api/v1/address/${id}`, data, {
    withCredentials: true,
  });

  return res.data;
}

export async function deleteAddress(id) {
  const res = await axios.delete(`/api/v1/address/${id}`, {
    withCredentials: true,
  });

  return res.data;
}
