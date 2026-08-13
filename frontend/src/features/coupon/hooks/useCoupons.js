import { useQuery } from '@tanstack/react-query';
import { getALlCategory, getALlCoupon } from '../api/apiCoupon';

export function useGetAllCoupon(pageNumber = 1, category = '') {
  const {
    isPending,
    error,
    data: coupons,
  } = useQuery({
    queryKey: ['coupons', pageNumber, category],
    queryFn: () => getALlCoupon(pageNumber, category),
  });

  return { isPending, error, coupons };
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
