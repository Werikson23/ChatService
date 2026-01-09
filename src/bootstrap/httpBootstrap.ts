import fastify from 'fastify';
import { Server } from 'socket.io';
import { PrometheusMetrics } from '../infra/observability/PrometheusMetrics';

export async function bootstrapHttp(metrics?: PrometheusMetrics) {
  const app = fastify({
    logger: false,
  });

  /** Metrics endpoint */
  if (metrics) {
    app.get('/metrics', async (_, reply) => {
      reply.header(
        'Content-Type',
        metrics.getRegistry().contentType
      );
      return metrics.getRegistry().metrics();
    });
  }

  /** Fastify ESCUTA */
  const port = Number(process.env.HTTP_PORT) || 3001;
  const host = '0.0.0.0';

  await app.listen({ port, host });

  console.log(`🌐 HTTP rodando em ${host}:${port}`);

  /** Socket.IO usa o server do Fastify */
  const io = new Server(app.server, {
    cors: { origin: '*' },
  });

  return { app, io };
}
