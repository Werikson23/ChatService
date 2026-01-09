import { CommandBus } from './CommandBus';
import { EventBus } from './EventBus';
import { QueryBus } from './QueryBus';
import { IPlugin } from './IPlugin';
import { RealtimePort } from './ports/RealtimePort';
import { LoggerPort } from './ports/LoggerPort';
import { MetricsPort } from './ports/MetricsPort';

export class Kernel {
  public readonly commandBus: CommandBus;
  public readonly eventBus: EventBus;
  public readonly queryBus: QueryBus;
  public readonly plugins: IPlugin[] = [];

  private realtime?: RealtimePort;
  private logger?: LoggerPort;
  private metrics?: MetricsPort;

  constructor() {
    this.commandBus = new CommandBus();
    this.eventBus = new EventBus();
    this.queryBus = new QueryBus();
  }

  /* ─────────────────────────────────────────── */
  /* Infra injection                             */
  /* ─────────────────────────────────────────── */

  attachRealtime(realtime: RealtimePort) {
    this.realtime = realtime;
  }

  attachLogger(logger: LoggerPort) {
    this.logger = logger;
  }

  attachMetrics(metrics: MetricsPort) {
    this.metrics = metrics;
  }

  /* ─────────────────────────────────────────── */
  /* Getters seguros para plugins                */
  /* ─────────────────────────────────────────── */

  getRealtime(): RealtimePort | undefined {
    return this.realtime;
  }

  getLogger(): LoggerPort | undefined {
    return this.logger;
  }

  getMetrics(): MetricsPort | undefined {
    return this.metrics;
  }

  /* ─────────────────────────────────────────── */
  /* Plugins                                     */
  /* ─────────────────────────────────────────── */

  registerPlugin(plugin: IPlugin) {
    this.plugins.push(plugin);
    plugin.register(this);
  }
}
