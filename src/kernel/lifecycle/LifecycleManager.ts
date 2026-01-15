import { Kernel } from '../Kernel';
import { HealthCheck } from './HealthCheck';
import { StartupTasks } from './StartupTasks';
import { Metrics } from './Metrics';
import { GracefulShutdown } from './GracefulShutdown';

export class LifecycleManager {
  private started = false;

  constructor(private readonly kernel: Kernel) {}

  async startup() {
    if (this.started) {
      this.kernel.getLogger()?.warn?.('⚠️ Lifecycle já inicializado');
      return;
    }

    const logger = this.kernel.getLogger();

    try {
      logger?.info?.('⚡ Executando Startup Tasks...');
      await StartupTasks.run();

      logger?.info?.('💓 Verificando saúde do sistema...');
      await HealthCheck.run();

      logger?.info?.('📊 Inicializando métricas...');
      Metrics.init();

      logger?.info?.('🧠 Inicializando Kernel...');
      await this.kernel.initialize();

      logger?.info?.('🛑 Configurando desligamento seguro...');
      GracefulShutdown.init(); // ✅ assinatura preservada

      this.started = true;
      logger?.info?.('🌟 Sistema pronto!');
    } catch (err) {
      logger?.error?.('❌ Falha crítica durante o startup', err);
      throw err;
    }
  }

  async shutdown() {
    if (!this.started) return;

    const logger = this.kernel.getLogger();

    try {
      logger?.info?.('🧹 Finalizando Kernel...');
      await this.kernel.shutdown();

      logger?.info?.('👋 Sistema finalizado com sucesso');
    } catch (err) {
      logger?.error?.('⚠️ Erro durante shutdown', err);
    } finally {
      this.started = false;
    }
  }
}
