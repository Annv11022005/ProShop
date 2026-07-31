import axios from 'axios';

export async function getUsers() {
  const res = await axios.get('/api/v1/users');

  return res.data;
}

export async function getUserById(id) {
  const res = await axios.get(`/api/v1/users/${id}`);

  return res.data;
}

export async function updateUser({ id, data }) {
  const res = await axios.put(`/api/v1/users/${id}`, data);

  return res.data;
}

export async function deleteUser(id) {
  const res = await axios.delete(`/api/v1/users/${id}`);

  return res.data;
}
