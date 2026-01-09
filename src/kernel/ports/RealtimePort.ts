export interface RealtimePort {
  broadcast(event: string, payload: unknown): Promise<void>;
}
