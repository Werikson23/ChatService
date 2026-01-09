export class StartupTasks {
  static async run(): Promise<void> {
    try {
      console.log('⚡ StartupTasks: executando tarefas iniciais...');
      // Ex.: pré-carregar caches, inicializar filas, seeds
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log('⚡ StartupTasks: tarefas concluídas');
    } catch (err) {
      console.error('❌ StartupTasks falhou', err);
      throw err;
    }
  }
}
