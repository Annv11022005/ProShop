import axios from 'axios';

export async function getProducts() {
  const res = await axios.get('/api/products');

  return res.data;
}

export async function getProduct(id) {
  const res = await axios.get(`/api/product/${id}`);

  return res.data;
}
