type HealthLogger = {
  info?(message: string): void;
  error?(message: string, err?: unknown): void;
};

export class HealthCheck {
  private static logger?: HealthLogger;

  /**
   * Injeta logger opcional (ex: vindo do Kernel).
   * Não é obrigatório.
   */
  static setLogger(logger: HealthLogger) {
    this.logger = logger;
  }

  static async run(): Promise<void> {
    const log = this.logger;

    try {
      log?.info?.('💓 HealthCheck: verificando serviços...');
      if (!log) console.log('💓 HealthCheck: verificando serviços...');

      // Aqui você pode checar DB, Redis, APIs, etc.
      await new Promise((resolve) => setTimeout(resolve, 100));

      log?.info?.('💓 HealthCheck: todos os serviços saudáveis');
      if (!log) console.log('💓 HealthCheck: todos os serviços saudáveis');
    } catch (err) {
      log?.error?.('❌ HealthCheck falhou', err);
      if (!log) console.error('❌ HealthCheck falhou', err);
      throw err;
    }
  }
}
