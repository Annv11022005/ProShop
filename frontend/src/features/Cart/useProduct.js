import { getProduct } from '@/services/apiProducts';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export function useProduct() {
  const { id: productId } = useParams();
  const {
    isPending,
    error,
    data: product,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    retry: false,
  });

  return { isPending, error, data: product };
}
