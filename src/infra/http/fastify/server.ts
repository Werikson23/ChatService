import Fastify from 'fastify';
import cors from '@fastify/cors';

export function createHttpServer() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
    trustProxy: true,
  });

  /* ────────────────────────────────────────────── */
  /* CORS controlado                               */
  /* ────────────────────────────────────────────── */
  app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // CLI, health, etc
      const allowed = (process.env.CORS_ORIGINS || '').split(',');
      cb(null, allowed.includes(origin));
    },
    credentials: true,
  });

  /* ────────────────────────────────────────────── */
  /* Health check real                             */
  /* ────────────────────────────────────────────── */
  app.get('/health', async () => {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
      pid: process.pid,
      memory: process.memoryUsage().rss,
    };
  });

  /* ────────────────────────────────────────────── */
  /* Hook global de erro                           */
  /* ────────────────────────────────────────────── */
  app.setErrorHandler((error, _, reply) => {
    app.log.error(error);

    reply.status(500).send({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected error',
    });
  });

  /* ────────────────────────────────────────────── */
  /* Shutdown gracioso (Docker/K8s)                */
  /* ────────────────────────────────────────────── */
  app.addHook('onClose', async () => {
    app.log.info('HTTP server shutting down');
  });

  return app;
}
