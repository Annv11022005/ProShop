import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getCountUnread,
  getNotifications,
  makeReadAllNotification,
  makeReadNotification,
} from '../api/apiNotification';
import { useSelector } from 'react-redux';

export const useNotifications = () => {
  const userInfo = useSelector((state) => state?.auth?.userInfo);

  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
    select: (data) => ({
      notifications: data.pages.flatMap((page) => page.notifications),
      pageParams: data.pageParams,
    }),
    enabled: !!userInfo,
  });

  return {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export function useCountUnreadNotification() {
  const userInfo = useSelector((state) => state?.auth?.userInfo);

  const {
    data: count,
    isPending,
    error,
  } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getCountUnread,
    enabled: !!userInfo,
  });

  return { count, isPending, error };
}

export function useMakeRead() {
  const queryClient = useQueryClient();

  const { mutate: makeRead, isPending } = useMutation({
    mutationFn: makeReadNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return { makeRead, isPending };
}

export function useMakeReadAll() {
  const queryClient = useQueryClient();

  const { mutate: makeReadAll, isPending } = useMutation({
    mutationFn: makeReadAllNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return { makeReadAll, isPending };
}
