type StartupLogger = {
  info?(message: string): void;
  error?(message: string, err?: unknown): void;
};

type StartupTask = {
  name: string;
  critical?: boolean;
  run: () => Promise<void>;
};

export class StartupTasks {
  private static logger?: StartupLogger;
  private static tasks: StartupTask[] = [];

  /**
   * Injeta logger opcional (ex: Kernel)
   */
  static setLogger(logger: StartupLogger) {
    this.logger = logger;
  }

  /**
   * Registra tarefas de startup
   */
  static register(task: StartupTask) {
    this.tasks.push(task);
  }

  static async run(): Promise<void> {
    const log = this.logger;

    try {
      log?.info?.('⚡ StartupTasks: executando tarefas iniciais...');
      if (!log) console.log('⚡ StartupTasks: executando tarefas iniciais...');

      // Se ninguém registrou nada, mantém comportamento antigo
      if (this.tasks.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      for (const task of this.tasks) {
        try {
          log?.info?.(`⚡ StartupTask: ${task.name}`);
          if (!log) console.log(`⚡ StartupTask: ${task.name}`);

          await Promise.race([
            task.run(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), 5_000)
            ),
          ]);
        } catch (err) {
          log?.error?.(`❌ StartupTask falhou: ${task.name}`, err);
          if (!log) console.error(`❌ StartupTask falhou: ${task.name}`, err);

          if (task.critical) {
            throw err;
          }
        }
      }

      log?.info?.('⚡ StartupTasks: tarefas concluídas');
      if (!log) console.log('⚡ StartupTasks: tarefas concluídas');
    } catch (err) {
      log?.error?.('❌ StartupTasks falhou', err);
      if (!log) console.error('❌ StartupTasks falhou', err);
      throw err;
    }
  }
}
