import axios from 'axios';

export async function getALlCoupon(pageNumber = 1, category = '') {
  const params = { pageNumber };
  if (category && category !== 'All') {
    params.category = category;
  }
  const res = await axios.get('/api/v1/coupons', { params });

  return res.data;
}

export async function getALlCategory() {
  const res = await axios.get('/api/v1/coupons/category');

  return res.data;
}

export async function getCoupon(code) {
  const res = await axios.get('/api/v1/coupons/code', {
    params: { code },
  });

  return res.data;
}

export async function getCouponById(id) {
  const res = await axios.get(`/api/v1/coupons/${id}`);

  return res.data;
}

export async function createCoupon(data) {
  const res = await axios.post('/api/v1/coupons', data);

  return res.data;
}

export async function toggleCoupon(id) {
  const res = await axios.put(`/api/v1/coupons/${id}/toggle`);

  return res.data;
}

export async function updateCoupon({ id, data }) {
  const res = await axios.put(`/api/v1/coupons/${id}`, data);

  return res.data;
}

export async function deleteCoupon(id) {
  const res = await axios.delete(`/api/v1/coupons/${id}`);

  return res.data;
}
