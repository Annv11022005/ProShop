import axios from 'axios';

export async function getNotifications({ pageParam = 1 }) {
  const res = await axios.get('/api/v1/notifications', {
    params: { page: pageParam, limit: 20 },
  });

  return res.data;
}
