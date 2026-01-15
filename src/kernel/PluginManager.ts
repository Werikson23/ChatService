import { IPlugin } from './IPlugin';
import { Kernel } from './Kernel';

export interface PluginOptions {
  parallel?: boolean;
  sortByPriority?: boolean;
}

/* ─────────────────────────────────────────── */
/* Tipos auxiliares (opcionais, não invasivos) */
/* ─────────────────────────────────────────── */

type PrioritizedPlugin = IPlugin & {
  priority?: number;
};

type LifecyclePlugin = IPlugin & {
  beforeStart?(kernel: Kernel): Promise<void> | void;
  start?(): Promise<void> | void;
  afterStart?(kernel: Kernel): Promise<void> | void;
};

export class PluginManager {
  constructor(private readonly kernel: Kernel) {}

  async registerPlugins(
    plugins: IPlugin[],
    options: PluginOptions = {}
  ) {
    let ordered: IPlugin[] = [...plugins];

    /* ─────────────────────────────────────────── */
    /* Ordenação por prioridade (se habilitada)   */
    /* ─────────────────────────────────────────── */

    if (options.sortByPriority) {
      ordered.sort((a, b) => {
        const pa = (a as PrioritizedPlugin).priority ?? 0;
        const pb = (b as PrioritizedPlugin).priority ?? 0;
        return pb - pa;
      });
    }

    const run = async (plugin: IPlugin) => {
      const p = plugin as LifecyclePlugin;
      const name = plugin.name ?? plugin.constructor.name;

      try {
        this.kernel.getLogger()?.info?.(`Registrando plugin: ${name}`);

        this.kernel.registerPlugin(plugin);

        if (typeof p.beforeStart === 'function') {
          await p.beforeStart(this.kernel);
        }

        if (typeof p.start === 'function') {
          await p.start();
        }

        if (typeof p.afterStart === 'function') {
          await p.afterStart(this.kernel);
        }

        this.kernel.getLogger()?.info?.(`Plugin iniciado: ${name}`);
      } catch (err) {
        this.kernel.getLogger()?.error?.(
          `Falha ao iniciar plugin ${name}`,
          err
        );
      }
    };

    /* ─────────────────────────────────────────── */
    /* Execução                                   */
    /* ─────────────────────────────────────────── */

    if (options.parallel) {
      await Promise.all(ordered.map(run));
    } else {
      for (const plugin of ordered) {
        await run(plugin);
      }
    }

    this.kernel.getLogger()?.info?.('Processamento de plugins finalizado');
  }
}
