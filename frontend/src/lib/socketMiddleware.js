import { io } from 'socket.io-client';
import { setOnlineUsers, setUserTyping } from '../features/chat/chatSlice';
import { toast } from 'sonner';
import { queryClient } from './queryClient';

let socket;

const socketMiddleware = (store) => (next) => (action) => {
  if (action.type === 'socket/connect') {
    const userId = action.payload;

    if (socket?.connected) return next(action);

    socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
      query: { userId },
      withCredentials: true,
    });

    socket.on('newMessage', (message) => {
      const currentUserId = store.getState().auth?.userInfo?._id;
      if (!currentUserId) return;

      // Xóa trạng thái typing của người gửi khi đã gửi tin
      store.dispatch(
        setUserTyping({ userId: message.senderId, isTyping: false }),
      );

      // Xác định đối tác trò chuyện (partnerId)
      const partnerId =
        message.senderId === currentUserId
          ? message.receiverId
          : message.senderId;

      // Cập nhật trực tiếp cache tin nhắn của cuộc trò chuyện trong TanStack Query
      queryClient.setQueryData(['message', partnerId], (oldMessages = []) => {
        const exists = oldMessages.some((m) => m._id === message._id);
        if (exists) return oldMessages;
        return [...oldMessages, message];
      });

      // Invalidate danh sách chat để cập nhật thứ tự cuộc trò chuyện gần nhất
      queryClient.invalidateQueries({ queryKey: ['user'] });
    });

    // Lắng nghe trạng thái đang gõ phím
    socket.on('userTyping', ({ senderId }) => {
      store.dispatch(setUserTyping({ userId: senderId, isTyping: true }));
    });

    socket.on('userStoppedTyping', ({ senderId }) => {
      store.dispatch(setUserTyping({ userId: senderId, isTyping: false }));
    });

    socket.on('getOnlineUsers', (onlineUsers) => {
      store.dispatch(setOnlineUsers(onlineUsers));
    });

    socket.on('newNotification', (notification) => {
      toast.info(notification.title || 'New Notification', {
        description: notification.message,
        position: 'top-center',
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });
  }

  // Phát tín hiệu typing / stopTyping tới server
  if (action.type === 'socket/typing') {
    socket?.emit('typing', { receiverId: action.payload.receiverId });
  }

  if (action.type === 'socket/stopTyping') {
    socket?.emit('stop_typing', { receiverId: action.payload.receiverId });
  }

  if (action.type === 'socket/disconnect') {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }

  return next(action);
};

export default socketMiddleware;


