import { io } from 'socket.io-client';
import { messageReceived } from '../features/chat/chatSlice';
import { toast } from 'sonner';

let socket;

const socketMiddleware = (store) => (next) => (action) => {
  if (action.type === 'socket/connect') {
    const userId = action.payload;

    if (socket?.connected) return next(action);

    socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
      query: { userId },
    });

    socket.on('newMessage', (message) => {
      store.dispatch(messageReceived(message));
    });
    socket.on('newNotification', (notification) => {
      toast.info(notification.title || 'New Notification', {
        description: notification.message,
        position: 'top-center',
      });
    });
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
