import axios from 'axios';

export async function login(data) {
  const res = await axios.post('/api/v1/users/login', data, {
    withCredentials: true,
  });

  return res.data;
}

export async function logout() {
  const res = await axios.post(
    '/api/v1/users/logout',
    {},
    { withCredentials: true },
  );

  return res.data;
}

export async function register(data) {
  const res = await axios.post('/api/v1/users', data, {
    withCredentials: true,
  });

  return res.data;
}

export async function verifyOTP({ email, otp }) {
  const res = await axios.post(
    '/api/v1/users/register/verify',
    { email, otp },
    {
      withCredentials: true,
    },
  );

  return res.data;
}

export async function profile(data) {
  const res = await axios.put('/api/v1/users/profile', data, {
    withCredentials: true,
  });

  return res.data;
}

export async function GetAllWishlist() {
  const res = await axios.get('/api/v1/users/wishlist', {
    withCredentials: true,
  });

  return res.data;
}

export async function addToWishlist(productId) {
  const payload = typeof productId === 'object' ? productId : { productId };
  const res = await axios.post('/api/v1/users/wishlist', payload, {
    withCredentials: true,
  });

  return res.data;
}

export async function removeFromWishlist(id) {
  const res = await axios.delete(`/api/v1/users/wishlist/${id}`, {
    withCredentials: true,
  });

  return res.data;
}
