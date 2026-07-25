import axios from 'axios';

export async function getUsers() {
  const res = await axios.get('/api/users');

  return res.data;
}

export async function getUserById(id) {
  const res = await axios.get(`/api/users/${id}`);

  return res.data;
}

export async function updateUser({ id, data }) {
  const res = await axios.put(`/api/users/${id}`, data);

  return res.data;
}

export async function deleteUser(id) {
  const res = await axios.delete(`/api/users/${id}`);

  return res.data;
}
