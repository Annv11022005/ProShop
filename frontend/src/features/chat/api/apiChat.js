import axios from 'axios';

export async function userSeller() {
  const res = await axios.get('/api/v1/messages');

  return res.data;
}

export async function getUserChat() {
  const res = await axios.get('/api/v1/messages/users');

  return res.data;
}

export async function sendMessage({ user, data }) {
  const res = await axios.post(`/api/v1/messages/send/${user}`, data);

  return res.data;
}

export async function getMessages(userId) {
  const res = await axios.get(`/api/v1/messages/${userId}`);

  return res.data;
}
