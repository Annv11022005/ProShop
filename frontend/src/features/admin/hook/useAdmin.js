import { useMutation, useQuery } from '@tanstack/react-query';
import { getOrders, updateOrderToDelivered } from '../api/apiAdmin';

export function useGetOrders() {
  const {
    isPending,
    error,
    data: allOrders,
  } = useQuery({
    queryKey: ['allOrder'],
    queryFn: () => getOrders(),
  });

  return {
    isPending,
    error,
    allOrders,
  };
}

export function useUpdateOrder() {
  const {
    isPending,
    error,
    mutateAsync: deliverOrder,
  } = useMutation({
    mutationFn: (id) => updateOrderToDelivered(id),
  });

  return { isPending, error, deliverOrder };
}
