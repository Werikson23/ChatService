import client from 'prom-client';
import { MetricsPort } from '../../kernel/ports/MetricsPort';

export class PrometheusMetrics implements MetricsPort {
  private registry = new client.Registry();

  constructor() {
    client.collectDefaultMetrics({ register: this.registry });
  }

  counter(name: string, help: string, labels: string[] = []) {
    const metric = new client.Counter({
      name,
      help,
      labelNames: labels,
      registers: [this.registry],
    });

    return {
      inc: (labels = {}, value = 1) => metric.inc(labels, value),
    };
  }

  histogram(
    name: string,
    help: string,
    labels: string[] = [],
    buckets = [0.1, 0.3, 1, 3, 5]
  ) {
    const metric = new client.Histogram({
      name,
      help,
      labelNames: labels,
      buckets,
      registers: [this.registry],
    });

    return {
      observe: (labels, value) => metric.observe(labels, value),
    };
  }

  getRegistry() {
    return this.registry;
  }
}
