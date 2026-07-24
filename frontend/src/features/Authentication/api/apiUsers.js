import axios from 'axios';

export async function login(data) {
  const res = await axios.post('/api/users/login', data, {
    withCredentials: true,
  });

  return res.data;
}

export async function logout() {
  const res = await axios.post(
    '/api/users/logout',
    {},
    { withCredentials: true },
  );

  return res.data;
}

export async function register(data) {
  const res = await axios.post('/api/users', data, {
    withCredentials: true,
  });

  return res.data;
}

export async function profile(data) {
  const res = await axios.put('/api/users/profile', data, {
    withCredentials: true,
  });

  return res.data;
}
