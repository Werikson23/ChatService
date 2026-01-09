type CommandHandler<T> = (payload: T) => Promise<void>;

export class CommandBus {
  private handlers: Map<string, CommandHandler<any>> = new Map();

  register<T>(commandName: string, handler: CommandHandler<T>) {
    this.handlers.set(commandName, handler);
  }

  async execute<T>(commandName: string, payload: T) {
    const handler = this.handlers.get(commandName);
    if (!handler) throw new Error(`CommandHandler não encontrado para: ${commandName}`);
    await handler(payload);
  }
}
