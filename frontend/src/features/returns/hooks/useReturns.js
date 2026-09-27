import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReturnRequest,
  getReturnByOrderId,
  getReturnById,
  getMyReturns,
  getAllReturns,
  reviewReturn,
  updateReturnTracking,
  markReturnReceived,
  completeReturn,
  cancelReturn,
  uploadReturnProofImages,
} from '../api/apiReturns';

export function useGetReturnByOrder(orderId) {
  const {
    isPending,
    error,
    data: returnRequest,
    refetch,
  } = useQuery({
    queryKey: ['returnRequest', 'order', orderId],
    queryFn: () => getReturnByOrderId(orderId),
    enabled: !!orderId,
    retry: false,
    staleTime: 30 * 1000,
  });

  return { isPending, error, returnRequest, refetch };
}

export function useGetReturnById(id) {
  const {
    isPending,
    error,
    data: returnRequest,
    refetch,
  } = useQuery({
    queryKey: ['returnRequest', id],
    queryFn: () => getReturnById(id),
    enabled: !!id,
    retry: false,
  });

  return { isPending, error, returnRequest, refetch };
}

export function useMyReturns() {
  const {
    isPending,
    error,
    data: returns,
    refetch,
  } = useQuery({
    queryKey: ['myReturns'],
    queryFn: () => getMyReturns(),
  });

  return { isPending, error, returns, refetch };
}

export function useGetAllReturns({ page = 1, limit = 10, status = 'ALL' } = {}) {
  const {
    isPending,
    error,
    data,
    refetch,
  } = useQuery({
    queryKey: ['adminReturns', page, limit, status],
    queryFn: () => getAllReturns({ page, limit, status }),
    keepPreviousData: true,
  });

  return { isPending, error, data, refetch };
}

export function useCreateReturnRequest() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: submitReturnRequest,
    isPending,
    error,
  } = useMutation({
    mutationFn: createReturnRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['returnRequest', 'order', data.order] });
      queryClient.invalidateQueries({ queryKey: ['order', data.order] });
      queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
      queryClient.invalidateQueries({ queryKey: ['adminReturns'] });
    },
  });

  return { submitReturnRequest, isPending, error };
}

export function useReviewReturn() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: reviewReturnRequest,
    isPending,
    error,
  } = useMutation({
    mutationFn: reviewReturn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['returnRequest', data._id] });
      queryClient.invalidateQueries({ queryKey: ['returnRequest', 'order', data.order?._id || data.order] });
      queryClient.invalidateQueries({ queryKey: ['adminReturns'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });

  return { reviewReturnRequest, isPending, error };
}

export function useUpdateReturnTracking() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: submitTracking,
    isPending,
    error,
  } = useMutation({
    mutationFn: updateReturnTracking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['returnRequest', data._id] });
      queryClient.invalidateQueries({ queryKey: ['returnRequest', 'order', data.order?._id || data.order] });
      queryClient.invalidateQueries({ queryKey: ['adminReturns'] });
    },
  });

  return { submitTracking, isPending, error };
}

export function useMarkReturnReceived() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: markReceived,
    isPending,
    error,
  } = useMutation({
    mutationFn: markReturnReceived,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['returnRequest', data._id] });
      queryClient.invalidateQueries({ queryKey: ['adminReturns'] });
    },
  });

  return { markReceived, isPending, error };
}

export function useCompleteReturn() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: completeReturnRequest,
    isPending,
    error,
  } = useMutation({
    mutationFn: completeReturn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['returnRequest', data._id] });
      queryClient.invalidateQueries({ queryKey: ['returnRequest', 'order', data.order?._id || data.order] });
      queryClient.invalidateQueries({ queryKey: ['adminReturns'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });

  return { completeReturnRequest, isPending, error };
}

export function useCancelReturn() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: cancelReturnRequest,
    isPending,
    error,
  } = useMutation({
    mutationFn: cancelReturn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['returnRequest', data._id] });
      queryClient.invalidateQueries({ queryKey: ['returnRequest', 'order', data.order?._id || data.order] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['adminReturns'] });
    },
  });

  return { cancelReturnRequest, isPending, error };
}

export function useUploadReturnProof() {
  const {
    mutateAsync: uploadProof,
    isPending,
    error,
  } = useMutation({
    mutationFn: uploadReturnProofImages,
  });

  return { uploadProof, isPending, error };
}
