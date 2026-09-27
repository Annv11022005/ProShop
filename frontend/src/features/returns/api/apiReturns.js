import axios from 'axios';

export async function createReturnRequest(data) {
  const res = await axios.post('/api/v1/returns', data, {
    withCredentials: true,
  });
  return res.data;
}

export async function getReturnByOrderId(orderId) {
  const res = await axios.get(`/api/v1/returns/order/${orderId}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getReturnById(id) {
  const res = await axios.get(`/api/v1/returns/${id}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getMyReturns() {
  const res = await axios.get('/api/v1/returns/mine', {
    withCredentials: true,
  });
  return res.data;
}

export async function getAllReturns({ page = 1, limit = 10, status = 'ALL' } = {}) {
  const params = { page, limit };
  if (status && status !== 'ALL') {
    params.status = status;
  }
  const res = await axios.get('/api/v1/returns', {
    params,
    withCredentials: true,
  });
  return res.data;
}

export async function reviewReturn({ id, action, rejectReason, warehouseAddress, instructions }) {
  const res = await axios.put(
    `/api/v1/returns/${id}/review`,
    { action, rejectReason, warehouseAddress, instructions },
    { withCredentials: true },
  );
  return res.data;
}

export async function updateReturnTracking({ id, carrier, trackingCode, note }) {
  const res = await axios.put(
    `/api/v1/returns/${id}/tracking`,
    { carrier, trackingCode, note },
    { withCredentials: true },
  );
  return res.data;
}

export async function markReturnReceived(id) {
  const res = await axios.put(
    `/api/v1/returns/${id}/receive`,
    {},
    { withCredentials: true },
  );
  return res.data;
}

export async function completeReturn({ id, restock = true, note }) {
  const res = await axios.put(
    `/api/v1/returns/${id}/complete`,
    { restock, note },
    { withCredentials: true },
  );
  return res.data;
}

export async function cancelReturn(id) {
  const res = await axios.put(
    `/api/v1/returns/${id}/cancel`,
    {},
    { withCredentials: true },
  );
  return res.data;
}

export async function uploadReturnProofImages(formData) {
  const res = await axios.post('/api/upload/return-proof', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return res.data;
}
