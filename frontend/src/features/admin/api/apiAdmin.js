import axios from 'axios';

export async function getOrders() {
  const res = await axios.get('/api/orders');

  return res.data;
}

export async function updateOrderToDelivered(id) {
  const res = await axios.put(`/api/orders/${id}/deliver`);

  return res.data;
}
