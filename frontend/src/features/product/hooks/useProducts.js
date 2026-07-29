import { getProducts } from '../api/apiProducts';
import { useQuery } from '@tanstack/react-query';

export function useProducts({ pageNumber = 1, keyword = '' } = {}) {
  const { isPending, error, refetch, data } = useQuery({
    queryKey: ['product', pageNumber, keyword],
    queryFn: () => getProducts({ pageNumber, keyword }),
  });

  return { isPending, error, data, refetch };
}
