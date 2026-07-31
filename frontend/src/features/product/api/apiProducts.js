import axios from 'axios';

function mapSort(sort) {
  if (!sort) return undefined;
  const [field, order] = sort.split('-');
  return order === 'desc' ? `-${field}` : field;
}

function mapStockFilter(stock) {
  if (stock === 'countInStock') {
    return { 'countInStock[gt]': '0' };
  }
  if (stock === 'countOfStock') {
    return { countInStock: 0 };
  }
  return {};
}

export async function getProducts({
  pageNumber = 1,
  keyword = '',
  sort,
  stock,
  ...restFilters
} = {}) {
  const { data } = await axios.get('/api/v1/products', {
    params: {
      pageNumber,
      keyword,
      sort: mapSort(sort),
      ...mapStockFilter(stock),
      ...restFilters,
    },
  });

  return data;
}

export async function getProduct(idOrSlug) {
  const res = await axios.get(`/api/v1/products/${idOrSlug}`);

  return res.data;
}

export async function getTopProducts() {
  const res = await axios.get('/api/v1/products/top');

  return res.data;
}

export async function createProduct(data) {
  const res = await axios.post('/api/v1/products', data);

  return res.data;
}

export async function updateProduct({ id, data }) {
  const res = await axios.put(`/api/v1/products/${id}`, data);

  return res.data;
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await axios.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
}

export async function deleteProduct(id) {
  const res = await axios.delete(`/api/v1/products/${id}`);

  return res.data;
}

export async function createReview({ id, data }) {
  const res = await axios.post(`/api/v1/products/${id}/reviews`, data);

  return res.data;
}
