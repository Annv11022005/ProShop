import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

let io;
// Quản lý đa thiết bị: Map<userId, Set<socket.id>>
const userSocketMap = new Map();

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, item) => {
    const [key, ...value] = item.trim().split('=');
    if (key) acc[key] = decodeURIComponent(value.join('='));
    return acc;
  }, {});
}

const createWebSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: [allowedOrigin],
      credentials: true,
    },
  });

  // Socket Authentication Middleware: Xác thực JWT từ Cookie hoặc Handshake Auth
  io.use((socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const token = cookies.jwt || socket.handshake.auth?.token;

      if (!token) {
        // Nếu client truyền userId qua query trong quá trình phát triển nhưng không có token
        const queryUserId = socket.handshake.query?.userId;
        if (queryUserId && process.env.NODE_ENV === 'development') {
          socket.userId = queryUserId.toString();
          return next();
        }
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId.toString();
      next();
    } catch (err) {
      console.error('Socket authentication failed:', err.message);
      next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;

    if (userId) {
      // 1. Thêm socket.id vào Set của user
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }
      userSocketMap.get(userId).add(socket.id);

      // 2. Join vào room riêng của user để gửi broadcast đa thiết bị
      socket.join(`user_${userId}`);
    }

    // 3. Broadcast danh sách user online
    io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));

    // 4. Lắng nghe sự kiện typing / stop_typing
    socket.on('typing', ({ receiverId }) => {
      if (receiverId && userId) {
        sendToUser(receiverId, 'userTyping', { senderId: userId });
      }
    });

    socket.on('stop_typing', ({ receiverId }) => {
      if (receiverId && userId) {
        sendToUser(receiverId, 'userStoppedTyping', { senderId: userId });
      }
    });

    socket.on('disconnect', () => {
      if (userId && userSocketMap.has(userId)) {
        const userSockets = userSocketMap.get(userId);
        userSockets.delete(socket.id);

        // Nếu user không còn tab/thiết bị nào mở thì xóa khỏi map
        if (userSockets.size === 0) {
          userSocketMap.delete(userId);
        }
      }
      io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));
    });
  });


  return io;
};

// Gửi event tới tất cả tab/thiết bị của 1 user thông qua room
export function sendToUser(userId, event, data) {
  if (!io || !userId) return;
  io.to(`user_${userId.toString()}`).emit(event, data);
}

export function getReceiverSocketId(userId) {
  if (!userId || !userSocketMap.has(userId.toString())) return null;
  const sockets = userSocketMap.get(userId.toString());
  return sockets.size > 0 ? Array.from(sockets)[0] : null;
}

export function isUserOnline(userId) {
  return !!userId && userSocketMap.has(userId.toString());
}

export { io };
export default createWebSocketServer;

