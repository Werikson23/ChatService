type EventHandler = (payload: unknown) => Promise<void> | void;

type EventBusLogger = {
  info?(message: string): void;
  error?(message: string, err?: unknown): void;
};

export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();
  private logger?: EventBusLogger;

  /**
   * Injeta logger opcional (ex: Kernel)
   */
  setLogger(logger: EventBusLogger) {
    this.logger = logger;
  }

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    const set = this.handlers.get(event)!;

    if (set.has(handler)) {
      this.logger?.info?.(`⚠️ Handler duplicado ignorado para evento: ${event}`);
      return;
    }

    set.add(handler);
    this.logger?.info?.(`📣 Handler registrado para evento: ${event}`);
  }

  async emit(event: string, payload: unknown) {
    const handlers = this.handlers.get(event);

    if (!handlers || handlers.size === 0) {
      this.logger?.info?.(`📭 Evento sem handlers: ${event}`);
      return;
    }

    this.logger?.info?.(`📢 Emitindo evento: ${event} (${handlers.size} handlers)`);

    const executions = Array.from(handlers).map(async (handler) => {
      try {
        await handler(payload);
      } catch (err) {
        this.logger?.error?.(`❌ Erro em handler do evento: ${event}`, err);
      }
    });

    // Executa todos, sem deixar um erro bloquear os outros
    await Promise.all(executions);
  }

  /**
   * Introspecção (debug / admin / health)
   */
  listEvents(): readonly string[] {
    return Array.from(this.handlers.keys());
  }
}
