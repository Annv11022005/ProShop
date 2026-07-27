import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAddress,
  deleteAddress,
  getAllAddress,
  getDefaultAddress,
  updateAddress,
  updateDefaultAddress,
} from '../api/apiAddress';

export function useGetAllAddress() {
  const {
    isPending,
    error,
    data: allAddress,
  } = useQuery({
    queryKey: ['address'],
    queryFn: () => getAllAddress(),
    retry: false,
  });

  return {
    isPending,
    error,
    allAddress,
  };
}

export function useGetDefaultAddress() {
  const {
    isPending,
    error,
    refetch,
    data: currentAddress,
  } = useQuery({
    queryKey: ['address', 'default'],
    queryFn: () => getDefaultAddress(),
    retry: false,
  });

  return {
    isPending,
    error,
    currentAddress,
    refetch,
  };
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutateAsync: addAddress,
  } = useMutation({
    mutationFn: (data) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['address'] });
    },
  });

  return {
    isPending,
    error,
    addAddress,
  };
}

export function useUpdateDefaultAddress() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutate: replaceDefaultAddress,
  } = useMutation({
    mutationFn: (id) => updateDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['address', 'default'] });
    },
  });

  return {
    isPending,
    error,
    replaceDefaultAddress,
  };
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutateAsync: replaceAddress,
  } = useMutation({
    mutationFn: ({ id, data }) => updateAddress({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['address'] });
      queryClient.invalidateQueries({ queryKey: ['address', 'default'] });
    },
  });

  return {
    isPending,
    error,
    replaceAddress,
  };
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    mutateAsync: deletedAddress,
  } = useMutation({
    mutationFn: (id) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['address'] });
      queryClient.invalidateQueries({ queryKey: ['address', 'default'] });
    },
  });

  return {
    isPending,
    error,
    deletedAddress,
  };
}
