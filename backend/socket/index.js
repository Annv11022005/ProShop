import { Server } from 'socket.io';

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

let io;
const userSocketMap = {};

const createWebSocketServer = (server) => {
  io = new Server(server, { cors: { origin: [allowedOrigin] } });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() sends event to everyone - broadcast
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
      if (userId) delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });

  return io;
};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io };
export default createWebSocketServer;
