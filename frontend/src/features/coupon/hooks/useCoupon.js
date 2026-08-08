import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCouponById,
  toggleCoupon,
  updateCoupon,
} from '../api/apiCoupon';

export function useGetCouponByCode(code) {
  const {
    isPending,
    error,
    data: coupon,
  } = useQuery({
    queryKey: ['coupon', 'code', code],
    queryFn: () => getCoupon(code),
    enabled: !!code,
    retry: false,
  });

  return { isPending, error, coupon };
}

export function useCreateCoupon() {
  const {
    isPending,
    error,
    mutate: createdCoupon,
  } = useMutation({
    mutationFn: createCoupon,
  });

  return { isPending, error, createdCoupon };
}

export function useGetCouponById(id) {
  const {
    isPending,
    error,
    data: coupon,
  } = useQuery({
    queryKey: ['coupon', 'id', id],
    queryFn: () => getCouponById(id),
    enabled: !!id,
    retry: false,
  });

  return { isPending, error, coupon };
}

export function useToggleCoupon() {
  const {
    isPending,
    error,
    mutate: toggledCoupon,
  } = useMutation({
    mutationFn: toggleCoupon,
  });

  return { isPending, error, toggledCoupon };
}

export function useUpdateCoupon() {
  const {
    isPending,
    error,
    mutate: updatedCoupon,
  } = useMutation({
    mutationFn: updateCoupon,
  });

  return { isPending, error, updatedCoupon };
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutate: deletedCoupon,
  } = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  return { isPending, error, deletedCoupon };
}
