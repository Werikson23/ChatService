import { bootstrap } from './bootstrap/bootstrap';

let isShuttingDown = false;

async function shutdown(reason: string, error?: unknown) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  if (error) {
    console.error(`💥 ${reason}`, error);
  } else {
    console.warn(`🛑 ${reason}`);
  }

  // Aqui futuramente você pode chamar:
  // kernel?.getLifecycle()?.shutdown()
  // ou GracefulShutdown.run()

  process.exit(error ? 1 : 0);
}

async function main() {
  try {
    await bootstrap();
  } catch (err) {
    await shutdown('Falha crítica ao iniciar aplicação', err);
  }
}

/* ───────────────────────────────────────────── */
/* Process-level safety net                      */
/* ───────────────────────────────────────────── */

process.on('unhandledRejection', (reason) => {
  shutdown('UnhandledRejection detectado', reason);
});

process.on('uncaughtException', (err) => {
  shutdown('UncaughtException detectado', err);
});

process.on('SIGINT', () => {
  shutdown('SIGINT recebido');
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM recebido');
});

main();
