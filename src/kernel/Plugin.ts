/* ────────────────────────────────────────────── */
/* Contrato base de Plugins do Kernel             */
/* ────────────────────────────────────────────── */

export interface KernelPluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
}

export interface KernelPluginContext {
  readonly kernelVersion: string;
  readonly env: string;
  log(message: string): void;
}

export interface KernelPlugin {
  /** Metadados do plugin */
  readonly meta: KernelPluginMetadata;

  /** Executado ao registrar o plugin no Kernel */
  onRegister?(context: KernelPluginContext): void | Promise<void>;

  /** Executado na inicialização do sistema */
  onStart?(context: KernelPluginContext): void | Promise<void>;

  /** Executado no shutdown gracioso */
  onStop?(context: KernelPluginContext): void | Promise<void>;
}
/* ────────────────────────────────────────────── */
/* Contrato base de Plugins do Kernel             */
/* ────────────────────────────────────────────── */

export interface KernelPluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
}

export interface KernelPluginContext {
  readonly kernelVersion: string;
  readonly env: string;
  log(message: string): void;
}

export interface KernelPlugin {
  /** Metadados do plugin */
  readonly meta: KernelPluginMetadata;

  /** Executado ao registrar o plugin no Kernel */
  onRegister?(context: KernelPluginContext): void | Promise<void>;

  /** Executado na inicialização do sistema */
  onStart?(context: KernelPluginContext): void | Promise<void>;

  /** Executado no shutdown gracioso */
  onStop?(context: KernelPluginContext): void | Promise<void>;
}
