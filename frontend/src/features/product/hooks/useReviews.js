import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '../api/apiProducts';

export function useCreateReview() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutate: addReview,
  } = useMutation({
    mutationFn: ({ id, data }) => createReview({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });

  return {
    isPending,
    error,
    addReview,
  };
}
