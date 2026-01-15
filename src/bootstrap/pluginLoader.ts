import fs from 'fs';
import path from 'path';
import { IPlugin } from '../kernel/IPlugin';

interface PluginManifest {
  entry: string;
  required?: boolean;
}

export async function loadPlugins(): Promise<IPlugin[]> {
  const plugins: IPlugin[] = [];
  const pluginsDir = path.resolve(process.cwd(), 'src/plugins');
  console.log('📂 Procurando plugins em:', pluginsDir);

  if (!fs.existsSync(pluginsDir)) {
    console.warn(`📦 Diretório de plugins não encontrado: ${pluginsDir}`);
    return plugins;
  }

  for (const folder of fs.readdirSync(pluginsDir)) {
    const manifestPath = path.join(pluginsDir, folder, 'plugin.json');
    if (!fs.existsSync(manifestPath)) continue;

    try {
      const manifest: PluginManifest = JSON.parse(
        fs.readFileSync(manifestPath, 'utf-8')
      );

      const entryPath = path.join(pluginsDir, folder, manifest.entry);
      const module = await import(entryPath);

      const PluginClass = module.default;
      if (!PluginClass) {
        throw new Error('Plugin sem export default');
      }

      const instance: IPlugin = new PluginClass();
      plugins.push(instance);

      console.log(`🔌 Plugin importado: ${instance.name}`);
    } catch (err) {
      console.error(`❌ Falha ao importar plugin "${folder}"`, err);
      throw err; // se quiser respeitar "required" depois
    }
  }

  return plugins;
}
