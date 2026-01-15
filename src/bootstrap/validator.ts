import { IPlugin } from '../kernel/IPlugin';
import { IPluginManifest } from '../kernel/IPluginManifest';

/* ─────────────────────────────────────────── */
/* Validação do plugin.json                    */
/* ─────────────────────────────────────────── */
export function validateManifest(manifest: IPluginManifest) {
  if (!manifest.name) {
    throw new Error('❌ plugin.json sem "name"');
  }

  if (!manifest.entry) {
    throw new Error(`❌ Plugin "${manifest.name}" sem "entry"`);
  }

  if (
    manifest.dependencies &&
    !Array.isArray(manifest.dependencies)
  ) {
    throw new Error(
      `❌ Plugin "${manifest.name}": dependencies deve ser array`
    );
  }
}

/* ─────────────────────────────────────────── */
/* Validação do plugin em runtime              */
/* ─────────────────────────────────────────── */
export function validateRuntimePlugin(plugin: IPlugin) {
  if (!plugin.name || !plugin.version) {
    throw new Error('❌ Plugin inválido: name/version ausente');
  }

  if (typeof plugin.register !== 'function') {
    throw new Error(
      `❌ Plugin "${plugin.name}" não implementa register()`
    );
  }

  console.log(`✅ Plugin validado: ${plugin.name}@${plugin.version}`);
}
