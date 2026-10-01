import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMessages,
  getUserChat,
  markMessagesAsRead,
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
    data: HistoryMessages = [],
  } = useQuery({
    queryKey: ['message', id],
    queryFn: () => getMessages(id),
    enabled: !!id,
  });

  return { isPending, error, HistoryMessages };
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  const {
    isPending,
    error,
    mutate: sendedMessage,
  } = useMutation({
    mutationFn: sendMessage,
    onMutate: async ({ user: receiverId, tempMessage }) => {
      await queryClient.cancelQueries({ queryKey: ['message', receiverId] });

      const previousMessages =
        queryClient.getQueryData(['message', receiverId]) || [];

      if (tempMessage) {
        queryClient.setQueryData(['message', receiverId], (old = []) => [
          ...old,
          tempMessage,
        ]);
      }

      return { previousMessages, receiverId, tempId: tempMessage?._id };
    },
    onSuccess: (savedMessage, variables, context) => {
      const receiverId = variables.user;
      const tempId = context?.tempId;

      queryClient.setQueryData(['message', receiverId], (old = []) => {
        const alreadyHasSaved = old.some((m) => m._id === savedMessage._id);
        if (alreadyHasSaved) {
          return old.filter((m) => m._id !== tempId);
        }
        if (!tempId) return [...old, savedMessage];
        return old.map((m) => (m._id === tempId ? savedMessage : m));
      });

      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err, variables, context) => {
      if (context?.receiverId && context?.previousMessages) {
        queryClient.setQueryData(
          ['message', context.receiverId],
          context.previousMessages,
        );
      }
    },
  });

  return { isPending, error, sendedMessage };
}

export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();

  const {
    mutate: markAsRead,
    isPending,
  } = useMutation({
    mutationFn: markMessagesAsRead,
    onSuccess: (_data, senderId) => {
      queryClient.invalidateQueries({ queryKey: ['message', senderId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return { markAsRead, isPending };
}


