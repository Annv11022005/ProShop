import axios from 'axios';

export async function getOrders() {
  const res = await axios.get('/api/v1/orders');

  return res.data;
}

export async function updateOrderToDelivered(id) {
  const res = await axios.put(`/api/v1/orders/${id}/deliver`);

  return res.data;
}

export async function updateOrderStatus({ id, status, note }) {
  const res = await axios.put(`/api/v1/orders/${id}/status`, { status, note });

  return res.data;
}
