import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createOrder,
  getOrderbyID,
  payOrder,
  getPaypalClientId,
  getMyOrders,
  createVnpayPayment,
} from '../api/apiOrders';

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

export function useGetOrderDetail(orderId) {
  const {
    isPending,
    error,
    refetch,
    data: order,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderbyID(orderId),
    retry: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 0,
  });

  return { isPending, error, order, refetch };
}

export function usePayOrder() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutateAsync: payOrderItem,
  } = useMutation({
    mutationFn: ({ orderId, details }) =>
      payOrder({ id: orderId, detail: details }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
    },
  });

  return { isPending, error, payOrderItem };
}

export function useGetPayPalClientById() {
  const {
    isPending,
    error,
    data: paypal,
  } = useQuery({
    queryKey: ['paypal'],
    queryFn: () => getPaypalClientId(),
    retry: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 0,
  });

  return { isPending, error, paypal };
}

export function useOrderHistory() {
  const {
    isPending,
    error,
    data: myOrders,
  } = useQuery({
    queryKey: ['orderHistory'],
    queryFn: () => getMyOrders(),
    retry: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 0,
  });

  return { isPending, error, myOrders };
}

export function useCreateVnpayPayment() {
  const {
    isPending,
    error,
    mutateAsync: createPayment,
  } = useMutation({
    mutationFn: createVnpayPayment,
  });

  return { isPending, error, createPayment };
}
