import { useMutation } from '@tanstack/react-query';
import { profile } from '../api/apiUsers';

export function useProfileMutation() {
  const {
    isPending,
    error,
    mutateAsync: profileUser,
  } = useMutation({
    mutationFn: (data) => profile(data),
  });

  return { isPending, error, profileUser };
}
