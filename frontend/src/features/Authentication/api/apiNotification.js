import axios from 'axios';

export async function getNotifications({ pageParam = 1 }) {
  const res = await axios.get('/api/v1/notifications', {
    params: { pageNumber: pageParam },
  });

  return res.data;
}

export async function getCountUnread() {
  const res = await axios.get('/api/v1/notifications/unread-count');

  return res.data;
}

export async function makeReadNotification(id) {
  const res = await axios.put(`/api/v1/notifications/${id}`);

  return res.data;
}

export async function makeReadAllNotification() {
  const res = await axios.put('/api/v1/notifications/read-all');

  return res.data;
}
