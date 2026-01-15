import { CommandBus } from './CommandBus';
import { EventBus } from './EventBus';
import { QueryBus } from './QueryBus';
import { IPlugin } from './IPlugin';
import { RealtimePort } from './ports/RealtimePort';
import { LoggerPort } from './ports/LoggerPort';
import { MetricsPort } from './ports/MetricsPort';

/* ─────────────────────────────────────────── */
/* Hooks opcionais (não quebram plugins)       */
/* ─────────────────────────────────────────── */

interface InitializablePlugin {
  initialize?(kernel: Kernel): Promise<void> | void;
}

interface ShutdownablePlugin {
  shutdown?(kernel: Kernel): Promise<void> | void;
}

/* ─────────────────────────────────────────── */
/* Kernel                                      */
/* ─────────────────────────────────────────── */

export class Kernel {
  public readonly commandBus: CommandBus;
  public readonly eventBus: EventBus;
  public readonly queryBus: QueryBus;

  private readonly plugins: IPlugin[] = [];

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
  /* Getters seguros                             */
  /* ─────────────────────────────────────────── */

  getRealtime(): Readonly<RealtimePort> | undefined {
    return this.realtime;
  }

  getLogger(): Readonly<LoggerPort> | undefined {
    return this.logger;
  }

  getMetrics(): Readonly<MetricsPort> | undefined {
    return this.metrics;
  }

  /* ─────────────────────────────────────────── */
  /* Plugins                                    */
  /* ─────────────────────────────────────────── */

  registerPlugin(plugin: IPlugin) {
    if (this.plugins.includes(plugin)) return;

    this.plugins.push(plugin);

    try {
      plugin.register(this);
      this.logger?.info?.(`Plugin ${plugin.constructor.name} registrado`);
    } catch (err) {
      this.logger?.error?.(
        `Falha ao registrar plugin ${plugin.constructor.name}`,
        err
      );
    }
  }

  getPlugins(): readonly IPlugin[] {
    return this.plugins;
  }

  /* ─────────────────────────────────────────── */
  /* Lifecycle                                  */
  /* ─────────────────────────────────────────── */

  async initialize() {
    for (const plugin of this.plugins) {
      const p = plugin as IPlugin & InitializablePlugin;

      if (typeof p.initialize === 'function') {
        try {
          await p.initialize(this);
        } catch (err) {
          this.logger?.error?.(
            `Erro ao inicializar plugin ${plugin.constructor.name}`,
            err
          );
        }
      }
    }

    this.logger?.info?.('Kernel inicializado');
  }

  async shutdown() {
    for (const plugin of this.plugins) {
      const p = plugin as IPlugin & ShutdownablePlugin;

      if (typeof p.shutdown === 'function') {
        try {
          await p.shutdown(this);
        } catch (err) {
          this.logger?.error?.(
            `Erro ao finalizar plugin ${plugin.constructor.name}`,
            err
          );
        }
      }
    }

    this.logger?.info?.('Kernel finalizado');
  }
}
