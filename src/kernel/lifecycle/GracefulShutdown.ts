import process from 'process';

export class GracefulShutdown {
  static init() {
    const shutdown = async () => {
      console.log('🛑 Iniciando desligamento seguro...');
      // Aqui você pode limpar filas, desconectar DB, WebSocket, etc.
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log('🛑 Desligamento concluído');
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}
