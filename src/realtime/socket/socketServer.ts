import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisClient } from '../../infra/cache/redis/redisClient';

export function createSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  const pubClient = redisClient.duplicate();
  const subClient = redisClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket) => {
    console.log('🔌 Socket conectado:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Socket desconectado:', socket.id);
    });
  });

  return io;
}
