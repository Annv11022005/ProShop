import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createOrder, getOrderbyID } from '@/services/apiOrders';

export function useCreateOrder() {
  const {
    mutate: createOrderItems,
    isPending,
    error,
  } = useMutation({
    mutationFn: createOrder,
  });

  return { createOrderItems, isPending, error };
}

export function useGetOrderDetail() {
  const { id: orderId } = useParams();

  const {
    isPending,
    error,
    data: order,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderbyID(orderId),
    retry: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 0,
  });

  return { isPending, error, order };
}
