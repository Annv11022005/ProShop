import { getProducts } from '@/services/apiProducts';
import { useQuery } from '@tanstack/react-query';

export function useProducts() {
  const {
    isPending,
    error,
    data: products,
  } = useQuery({
    queryKey: ['product'],
    queryFn: () => getProducts(),
  });

  return { isPending, error, data: products };
}
