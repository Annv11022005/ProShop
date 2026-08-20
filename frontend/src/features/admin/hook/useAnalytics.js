import { useQuery } from '@tanstack/react-query';
import {
  getDashboardSummary,
  getRevenueAnalytics,
  getOrderStatusBreakdown,
  getLowStockProducts,
  getTopProducts,
} from '../api/apiAnalytics';

export function useDashboardSummary({ days = 30 } = {}) {
  const {
    isPending,
    error,
    data: summary,
    refetch,
  } = useQuery({
    queryKey: ['analytics', 'summary', days],
    queryFn: () => getDashboardSummary({ days }),
  });

  return { isPending, error, summary, refetch };
}

export function useRevenueAnalytics({ period = '7d' } = {}) {
  const {
    isPending,
    error,
    data: revenueData,
    refetch,
  } = useQuery({
    queryKey: ['analytics', 'revenue', period],
    queryFn: () => getRevenueAnalytics({ period }),
  });

  return { isPending, error, revenueData, refetch };
}

export function useOrderStatusBreakdown() {
  const {
    isPending,
    error,
    data: statusBreakdown,
    refetch,
  } = useQuery({
    queryKey: ['analytics', 'orders-status'],
    queryFn: () => getOrderStatusBreakdown(),
  });

  return { isPending, error, statusBreakdown, refetch };
}

export function useLowStockProducts() {
  const {
    isPending,
    error,
    data: lowStockProducts,
    refetch,
  } = useQuery({
    queryKey: ['analytics', 'low-stock'],
    queryFn: () => getLowStockProducts(),
  });

  return { isPending, error, lowStockProducts, refetch };
}

export function useTopProductsAnalytics() {
  const {
    isPending,
    error,
    data: topProducts,
    refetch,
  } = useQuery({
    queryKey: ['analytics', 'top-products'],
    queryFn: () => getTopProducts(),
  });

  return { isPending, error, topProducts, refetch };
}
