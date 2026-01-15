type QueryHandler<T, R> = (payload: T) => Promise<R>;

type QueryBusLogger = {
  info?(message: string): void;
  error?(message: string, err?: unknown): void;
};

export class QueryBus {
  private handlers: Map<string, QueryHandler<any, any>> = new Map();
  private logger?: QueryBusLogger;

  /**
   * Injeta logger opcional (ex: Kernel)
   */
  setLogger(logger: QueryBusLogger) {
    this.logger = logger;
  }

  register<T, R>(queryName: string, handler: QueryHandler<T, R>) {
    if (this.handlers.has(queryName)) {
      this.logger?.error?.(
        `⚠️ QueryHandler já registrado: ${queryName}`
      );
      return;
    }

    this.handlers.set(queryName, handler);
    this.logger?.info?.(`🔎 Query registrada: ${queryName}`);
  }

  async execute<T, R>(queryName: string, payload: T): Promise<R> {
    const handler = this.handlers.get(queryName);

    if (!handler) {
      const err = new Error(`QueryHandler não encontrado para: ${queryName}`);
      this.logger?.error?.('❌ Falha ao executar query', err);
      throw err;
    }

    try {
      return await handler(payload);
    } catch (err) {
      this.logger?.error?.(`❌ Erro ao executar query: ${queryName}`, err);
      throw err;
    }
  }

  /**
   * Introspecção (debug / health / admin)
   */
  listQueries(): readonly string[] {
    return Array.from(this.handlers.keys());
  }
}
