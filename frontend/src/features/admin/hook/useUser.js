import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, getUserById, getUsers, updateUser } from '../api/apiUser';

export function useGetUsers() {
  const {
    isPending,
    error,
    refetch,
    data: users,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUsers(),
  });

  return { isPending, error, users, refetch };
}

export function useGetUserById(id, enabled = true) {
  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id && enabled,
  });

  return { isPending, error, user };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutateAsync: updatedUser,
  } = useMutation({
    mutationFn: ({ id, data }) => updateUser({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { isPending, error, updatedUser };
}

export function useDeleteUser() {
  const {
    isPending,
    error,
    mutateAsync: deletedUser,
  } = useMutation({
    mutationFn: (id) => deleteUser(id),
  });

  return { isPending, error, deletedUser };
}
