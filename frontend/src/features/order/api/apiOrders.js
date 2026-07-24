import axios from 'axios';

export async function createOrder(data) {
  const res = await axios.post('/api/orders', data);

  return res.data;
}

export async function getOrderbyID(id) {
  const res = await axios.get(`/api/orders/${id}`);

  return res.data;
}

export async function payOrder({ id, detail }) {
  const res = await axios.put(`/api/orders/${id}/pay`, detail);

  return res.data;
}

export async function getPaypalClientId() {
  const res = await axios.get(`/api/config/paypal`);

  return res.data;
}

export async function getMyOrders() {
  const res = await axios.get('/api/orders/mine');

  return res.data;
}
