// kernel/ports/PubSubPort.ts
export interface PubSubPort {
  publish(event: string, payload: unknown): Promise<void>;
  subscribe(
    event: string,
    handler: (payload: unknown) => void
  ): Promise<void>;
}
