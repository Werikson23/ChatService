type QueryHandler<T, R> = (payload: T) => Promise<R>;

export class QueryBus {
  private handlers: Map<string, QueryHandler<any, any>> = new Map();

  register<T, R>(queryName: string, handler: QueryHandler<T, R>) {
    this.handlers.set(queryName, handler);
  }

  async execute<T, R>(queryName: string, payload: T): Promise<R> {
    const handler = this.handlers.get(queryName);
    if (!handler) throw new Error(`QueryHandler não encontrado para: ${queryName}`);
    return handler(payload);
  }
}
