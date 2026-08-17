import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import createWebSocketServer from './socket/index.js';
import { startReservationCleanupJob } from './jobs/releaseExpiredReservations.js';

const port = process.env.PORT || 5000;

connectDB(); //connect mongoDB

const server = http.createServer(app);
createWebSocketServer(server);

startReservationCleanupJob();

server.listen(port, () => console.log(`server running on port ${port}`));
