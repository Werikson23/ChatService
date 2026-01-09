export interface MetricsPort {
  counter(
    name: string,
    help: string,
    labels?: string[]
  ): {
    inc(labels?: Record<string, string>, value?: number): void;
  };

  histogram(
    name: string,
    help: string,
    labels?: string[],
    buckets?: number[]
  ): {
    observe(labels: Record<string, string>, value: number): void;
  };
}
