import axios from 'axios';

export async function createOrder(data) {
  const res = await axios.post('/api/v1/orders', data, {
    withCredentials: true,
  });

  return res.data;
}

export async function getOrderbyID(id) {
  const res = await axios.get(`/api/v1/orders/${id}`, {
    withCredentials: true,
  });

  return res.data;
}

export async function payOrder({ id, detail }) {
  const res = await axios.put(`/api/v1/orders/${id}/pay`, detail, {
    withCredentials: true,
  });

  return res.data;
}

export async function getPaypalClientId() {
  const res = await axios.get(`/api/config/paypal`);

  return res.data;
}

export async function getMyOrders() {
  const res = await axios.get('/api/v1/orders/mine', {
    withCredentials: true,
  });

  return res.data;
}
