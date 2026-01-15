import process from 'process';

export class GracefulShutdown {
  private static shuttingDown = false;

  static init() {
    const shutdown = async (signal?: string) => {
      if (this.shuttingDown) return;
      this.shuttingDown = true;

      console.log(`🛑 Iniciando desligamento seguro...${signal ? ` (${signal})` : ''}`);

      // Timeout de segurança (evita travar para sempre)
      const forceExitTimeout = setTimeout(() => {
        console.error('⚠️ Forçando encerramento após timeout');
        process.exit(1);
      }, 10_000);

      try {
        // Aqui você pode limpar filas, desconectar DB, WebSocket, etc.
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log('🛑 Desligamento concluído');
        clearTimeout(forceExitTimeout);
        process.exit(0);
      } catch (err) {
        console.error('❌ Erro durante desligamento', err);
        clearTimeout(forceExitTimeout);
        process.exit(1);
      }
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
    process.once('uncaughtException', (err) => {
      console.error('💥 Exceção não tratada', err);
      shutdown('uncaughtException');
    });
    process.once('unhandledRejection', (reason) => {
      console.error('💥 Promise rejeitada sem catch', reason);
      shutdown('unhandledRejection');
    });
  }
}
