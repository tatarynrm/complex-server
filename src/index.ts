import { Server } from 'socket.io';
import app from './app';
const PORT = process.env.PORT || 4000;
import http from 'http';
import { setupSocket } from './config/sockets';
import { startCronJob } from './crone_jobs';
import { getVodafoneToken } from './helpers/vodafone-token.service';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3005',
      'https://complex.ict.lviv.ua',
    ],
    credentials: true,
  },
});

app.locals.io = io;
setupSocket(io);

startCronJob();
const getToken = async () => {
  return await getVodafoneToken();
};
getToken();
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} ✅✅✅`);
});
