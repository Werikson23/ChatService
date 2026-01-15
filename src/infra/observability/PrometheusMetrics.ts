import client from 'prom-client';
import { MetricsPort } from '../../kernel/ports/MetricsPort';

export class PrometheusMetrics implements MetricsPort {
  private registry = new client.Registry();

  constructor() {
    // Coleta métricas padrão do Node.js
    client.collectDefaultMetrics({ register: this.registry });
  }

  /**
   * Cria um contador
   * @param name Nome da métrica
   * @param help Descrição da métrica
   * @param labels Labels que a métrica irá usar
   */
  counter(name: string, help: string, labels: string[] = []) {
    const metric = new client.Counter({
      name,
      help,
      labelNames: labels,
      registers: [this.registry],
    });

    return {
      /**
       * Incrementa o contador
       * @param labels Labels do contador (opcional)
       * @param value Valor a incrementar (default = 1)
       */
      inc: (labels: Record<string, string> = {}, value: number = 1) => metric.inc(labels, value),
    };
  }

  /**
   * Cria um histograma
   * @param name Nome da métrica
   * @param help Descrição da métrica
   * @param labels Labels que a métrica irá usar
   * @param buckets Buckets do histograma
   */
  histogram(
    name: string,
    help: string,
    labels: string[] = [],
    buckets: number[] = [0.1, 0.3, 1, 3, 5]
  ) {
    const metric = new client.Histogram({
      name,
      help,
      labelNames: labels,
      buckets,
      registers: [this.registry],
    });

    return {
      /**
       * Registra uma observação no histograma
       * @param labels Labels da observação (opcional)
       * @param value Valor da observação
       */
      observe: (labels: Record<string, string> = {}, value: number) => metric.observe(labels, value),
    };
  }

  /**
   * Retorna o registry do Prometheus
   */
  getRegistry() {
    return this.registry;
  }
}
