import axios from 'axios';

export async function getAllAddress() {
  const res = await axios.get('/api/address', {
    withCredentials: true,
  });

  return res.data;
}

export async function getDefaultAddress() {
  const res = await axios.get('/api/address/default', {
    withCredentials: true,
  });

  return res.data;
}

export async function createAddress(data) {
  const res = await axios.post('/api/address', data, {
    withCredentials: true,
  });

  return res.data;
}

export async function updateDefaultAddress(id) {
  const res = await axios.put(
    `/api/address/${id}/default`,
    {},
    {
      withCredentials: true,
    },
  );

  return res.data;
}

export async function updateAddress({ id, data }) {
  const res = await axios.put(`/api/address/${id}`, data, {
    withCredentials: true,
  });

  return res.data;
}

export async function deleteAddress(id) {
  const res = await axios.delete(`/api/address/${id}`, {
    withCredentials: true,
  });

  return res.data;
}
