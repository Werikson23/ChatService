import { Kernel } from '../Kernel';
import { HealthCheck } from './HealthCheck';
import { StartupTasks } from './StartupTasks';
import { Metrics } from './Metrics';
import { GracefulShutdown } from './GracefulShutdown';

export class LifecycleManager {
  constructor(private kernel: Kernel) {}

  async startup() {
    console.log('⚡ Executando Startup Tasks...');
    await StartupTasks.run();

    console.log('💓 Verificando saúde do sistema...');
    await HealthCheck.run();

    console.log('📊 Inicializando métricas...');
    Metrics.init();

    console.log('🛑 Configurando desligamento seguro...');
    GracefulShutdown.init();

    console.log('✅ Ciclo de vida iniciado');
  }
}
