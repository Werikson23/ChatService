import '../infra/config/env';

import { Kernel } from '../kernel/Kernel';
import { PluginManager } from '../kernel/PluginManager';
import { LifecycleManager } from '../kernel/lifecycle/LifecycleManager';

import { RedisPubSub } from '../infra/realtime/pubsub/RedisPubSub';
import { PrometheusMetrics } from '../infra/observability/PrometheusMetrics';

import { createLogger } from './loggerBootstrap';
import { loadPlugins } from './pluginLoader';
import {validateManifest,validateRuntimePlugin} from './validator';
import { bootstrapInfra } from './infraBootstrap';
import { bootstrapHttp } from './httpBootstrap';
import { bootstrapRealtime } from './realtimeBootstrap';

export async function bootstrap() {
  console.log('🚀 Inicializando aplicação...');

  /** Logger */
  const logger = createLogger();

  /** Kernel SEM argumentos */
  const kernel = new Kernel();

  /** Infra base */
  await bootstrapInfra();

  /** Metrics */
  const metrics = new PrometheusMetrics();
  kernel.attachMetrics(metrics);

  /** HTTP + Socket.IO */
  const { io } = await bootstrapHttp(metrics);

  /** Realtime (Redis Pub/Sub) */
  const realtime = new RedisPubSub();
  kernel.attachRealtime(realtime);

  /** Bridge EventBus → Realtime */
  bootstrapRealtime(kernel.eventBus, io);

  logger.info('Kernel inicializado');

  /** Plugins */
  const plugins = await loadPlugins();

  const pluginManager = new PluginManager(kernel);
  await pluginManager.registerPlugins(plugins);

  /** Lifecycle */
  const lifecycle = new LifecycleManager(kernel);
  await lifecycle.startup();

  console.log('🌟 Sistema pronto!');
  return kernel;
}
