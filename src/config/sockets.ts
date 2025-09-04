// /server/config/socket.ts
import { Server } from 'socket.io';
import chatSocket from '../sockets/chat.socket';
import truckSocket from '../sockets/truck.socket';



export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Підключення окремих модулів
    chatSocket(io, socket);
    truckSocket(io, socket);

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
