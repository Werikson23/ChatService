type CommandHandler<T> = (payload: T) => Promise<void>;

export class CommandBus {
  private readonly handlers: Map<string, CommandHandler<any>> = new Map();

  register<T>(commandName: string, handler: CommandHandler<T>) {
    if (!commandName) {
      throw new Error('❌ CommandBus: commandName é obrigatório');
    }

    if (typeof handler !== 'function') {
      throw new Error(`❌ CommandBus: handler inválido para "${commandName}"`);
    }

    if (this.handlers.has(commandName)) {
      console.warn(`⚠️ CommandBus: sobrescrevendo handler do comando "${commandName}"`);
    }

    this.handlers.set(commandName, handler);
  }

  async execute<T>(commandName: string, payload: T): Promise<void> {
    const handler = this.handlers.get(commandName);

    if (!handler) {
      throw new Error(`❌ CommandBus: CommandHandler não encontrado para "${commandName}"`);
    }

    try {
      await handler(payload);
    } catch (error) {
      console.error(`🔥 CommandBus: erro ao executar comando "${commandName}"`, error);
      throw error; // não engole erro em produção
    }
  }

  has(commandName: string): boolean {
    return this.handlers.has(commandName);
  }

  clear(): void {
    console.warn('🧹 CommandBus: limpando todos os handlers');
    this.handlers.clear();
  }
}
