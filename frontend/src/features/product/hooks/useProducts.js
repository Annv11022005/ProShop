import { useEffect } from 'react';
import { getProducts, getTopProducts } from '../api/apiProducts';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useProducts({
  pageNumber = 1,
  keyword = '',
  sort,
  stock,
  ...filters
} = {}) {
  const page = Number(pageNumber) || 1;
  const queryClient = useQueryClient();
  const { isPending, error, refetch, data } = useQuery({
    queryKey: ['product', pageNumber, keyword, sort, stock, filters],
    queryFn: () =>
      getProducts({ pageNumber, keyword, sort, stock, ...filters }),
  });

  useEffect(() => {
    if (data?.pages && page < data.pages) {
      queryClient.prefetchQuery({
        queryKey: ['product', page + 1, keyword, sort, stock, filters],
        queryFn: () =>
          getProducts({
            pageNumber: page + 1,
            keyword,
            sort,
            stock,
            ...filters,
          }),
      });
    }
  }, [data, page]);

  return { isPending, error, data, refetch };
}

export function useTopProduct() {
  const {
    isPending,
    error,
    data: products,
  } = useQuery({
    queryKey: ['topProduct'],
    queryFn: () => getTopProducts(),
  });

  return { isPending, error, products };
}
