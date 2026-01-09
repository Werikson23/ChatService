import Fastify from 'fastify';
import cors from '@fastify/cors';

export function createHttpServer() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });

  app.get('/health', async () => {
    return { status: 'ok', uptime: process.uptime() };
  });

  return app;
}
