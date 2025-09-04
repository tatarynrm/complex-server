// /server/sockets/chat.socket.ts
import { Server, Socket } from 'socket.io';

const chatSocket = (io: Server, socket: Socket) => {
  socket.on('chat:sendMessage', (message) => {
    console.log('📨 New message:', message);

    // Відправити всім, окрім відправника
    socket.broadcast.emit('chat:receiveMessage', message);
  });

  // інші події...
};

export default chatSocket;
