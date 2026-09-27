import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus,
} from '../api/apiAdmin';

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
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutateAsync: deliverOrder,
  } = useMutation({
    mutationFn: (id) => updateOrderToDelivered(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrder'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });

  return { isPending, error, deliverOrder };
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutateAsync: changeOrderStatus,
  } = useMutation({
    mutationFn: ({ id, status, note }) =>
      updateOrderStatus({ id, status, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrder'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });

  return { isPending, error, changeOrderStatus };
}
