import { useQuery } from '@tanstack/react-query';
import { getALlCategory, getALlCoupon } from '../api/apiCoupon';

export function useGetAllCoupon(pageNumber = 1) {
  const {
    isPending,
    error,
    data: coupons,
  } = useQuery({
    queryKey: ['coupons', pageNumber],
    queryFn: () => getALlCoupon(pageNumber),
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
