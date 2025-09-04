// /server/sockets/chat.socket.ts
import { Server, Socket } from 'socket.io';

const truckSocket = (io: Server, socket: Socket) => {
  socket.on('truck:new-truck', (data) => {
    console.log('📨 New truck:', data);

    // Відправити всім, окрім відправника
    socket.emit('truck:new-truck', data);
  });
  socket.on('truck:update-truck', (data) => {
    console.log('📨 New truck:', data);

    // Відправити всім, окрім відправника
    socket.emit('truck:update-truck', data);
  });

 

  // інші події...
};

export default truckSocket;
