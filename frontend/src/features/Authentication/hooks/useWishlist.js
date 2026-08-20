import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  addToWishlist as addToWishlistApi,
  GetAllWishlist,
  removeFromWishlist as removeFromWishlistApi,
} from '../api/apiUsers';

export function useGetWishlist() {
  const userInfo = useSelector((state) => state?.auth?.userInfo);

  const {
    isPending,
    error,
    data: wishlist,
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => GetAllWishlist(),
    enabled: !!userInfo,
  });

  return {
    isPending: !!userInfo && isPending,
    error,
    wishlist: wishlist || [],
  };
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutate: addToWishlist,
  } = useMutation({
    mutationFn: addToWishlistApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return { isPending, error, addToWishlist, addWishlist: addToWishlist };
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutate: removeFromWishlist,
  } = useMutation({
    mutationFn: removeFromWishlistApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return { isPending, error, removeFromWishlist, removeWishlist: removeFromWishlist };
}
