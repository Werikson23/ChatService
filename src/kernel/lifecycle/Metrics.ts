type MetricsProvider = {
  init(): void | Promise<void>;
};

export class Metrics {
  private static initialized = false;
  private static providers: MetricsProvider[] = [];

  /**
   * Registra providers de métricas (Prometheus, OTEL, etc.)
   */
  static register(provider: MetricsProvider) {
    this.providers.push(provider);
  }

  static async init() {
    if (this.initialized) {
      console.log('📊 Metrics: já inicializado');
      return;
    }

    console.log('📊 Metrics: inicializando métricas do sistema...');

    try {
      for (const provider of this.providers) {
        await provider.init();
      }

      this.initialized = true;
      console.log('📊 Metrics: métricas prontas');
    } catch (err) {
      console.error('❌ Metrics falhou', err);
    }
  }
}
