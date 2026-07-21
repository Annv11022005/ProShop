import axios from 'axios';

export async function createOrder(data) {
  const res = await axios.post('/api/orders', data);

  return res.data;
}

export async function getOrderbyID(id) {
  const res = await axios.get(`/api/orders/${id}`);

  return res.data;
}
