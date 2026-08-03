import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  toggleCoupon,
  updateCoupon,
} from '../api/apiCoupon';

export function useCouponById(id) {
  const {
    isPending,
    error,
    data: coupon,
  } = useQuery({
    queryKey: ['coupon', id],
    queryFn: () => getCoupon(id),
    enabled: !!id,
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
  const {
    isPending,
    error,
    mutate: deletedCoupon,
  } = useMutation({
    mutationFn: deleteCoupon,
  });

  return { isPending, error, deletedCoupon };
}
