import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getMessages,
  getUserChat,
  sendMessage,
  userSeller,
} from '../api/apiChat';

export function useGetIdSeller() {
  const {
    isPending,
    error,
    data: sellerId,
  } = useQuery({
    queryKey: ['admin'],
    queryFn: () => userSeller(),
  });

  return { isPending, error, sellerId };
}

export function useGetUserChatForAdmin() {
  const {
    isPending,
    error,
    data: userId,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserChat(),
  });

  return { isPending, error, userId };
}

export function useGetMessages(id) {
  const {
    isPending,
    error,
    data: HistoryMessages,
  } = useQuery({
    queryKey: ['message', id],
    queryFn: () => getMessages(id),
    enabled: !!id,
  });

  return { isPending, error, HistoryMessages };
}

export function useSendMessage() {
  const {
    isPending,
    error,
    mutate: sendedMessage,
  } = useMutation({
    mutationFn: sendMessage,
  });

  return { isPending, error, sendedMessage };
}
