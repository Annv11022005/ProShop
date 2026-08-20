import axios from 'axios';

export async function getDashboardSummary({ days = 30 } = {}) {
  const { data } = await axios.get('/api/v1/analytics/summary', {
    params: { days },
  });
  return data;
}

export async function getRevenueAnalytics({ period = '7d' } = {}) {
  const { data } = await axios.get('/api/v1/analytics/revenue', {
    params: { period },
  });
  return data;
}

export async function getOrderStatusBreakdown() {
  const { data } = await axios.get('/api/v1/analytics/orders-status');
  return data;
}

export async function getLowStockProducts() {
  const { data } = await axios.get('/api/v1/analytics/low-stock');
  return data;
}

export async function getTopProducts() {
  const { data } = await axios.get('/api/v1/analytics/top-products');
  return data;
}
