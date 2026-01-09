import { IPlugin } from './IPlugin';
import { Kernel } from './Kernel';

export class PluginManager {
  constructor(private kernel: Kernel) {}

  async registerPlugins(plugins: IPlugin[]) {
    for (const plugin of plugins) {
      console.log(`🔌 Registrando plugin: ${plugin.name} v${plugin.version}`);
      this.kernel.registerPlugin(plugin);
      if (plugin.start) await plugin.start();
    }
  }
}
