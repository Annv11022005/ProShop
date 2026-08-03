import { useQuery } from '@tanstack/react-query';
import { getALlCategory, getALlCoupon } from '../api/apiCoupon';

export function useGetAllCoupon() {
  const {
    isPending,
    error,
    data,
  } = useQuery({
    queryKey: ['coupons'],
    queryFn: getALlCoupon,
  });

  return { isPending, error, coupons: data?.coupons || [] };
}

export function useGetCategory() {
  const {
    isPending,
    error,
    data: categories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getALlCategory,
  });

  return { isPending, error, categories: categories || [] };
}
