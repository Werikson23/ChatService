type EventHandler = (payload: unknown) => Promise<void> | void;

export class EventBus {
  private handlers = new Map<string, EventHandler[]>();

  on(event: string, handler: EventHandler) {
    const list = this.handlers.get(event) ?? [];
    list.push(handler);
    this.handlers.set(event, list);
  }

  async emit(event: string, payload: unknown) {
    const handlers = this.handlers.get(event) ?? [];
    for (const handler of handlers) {
      await handler(payload);
    }
  }
}
