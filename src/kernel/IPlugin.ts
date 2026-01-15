import { Kernel } from './Kernel';

/* ─────────────────────────────────────────── */
/* Metadados opcionais (não quebram plugins)   */
/* ─────────────────────────────────────────── */

export interface PluginMeta {
  description?: string;
  author?: string;
  tags?: string[];
  critical?: boolean; // se true, falha pode derrubar o sistema no futuro
}

/* ─────────────────────────────────────────── */
/* Interface principal                         */
/* ─────────────────────────────────────────── */

export interface IPlugin {
  /** Nome único do plugin */
  name: string;

  /** Versão semântica */
  version: string;

  /** Prioridade de inicialização (maior inicia primeiro) */
  priority?: number;

  /** Metadados opcionais */
  meta?: PluginMeta;

  /**
   * Chamado no momento do registro.
   * Use apenas para bind de handlers e eventos.
   */
  register(kernel: Kernel): void;

  /**
   * Hook chamado antes da inicialização principal.
   */
  beforeStart?(kernel: Kernel): Promise<void> | void;

  /**
   * Inicialização principal do plugin.
   */
  start?(kernel: Kernel): Promise<void> | void;

  /**
   * Hook chamado após inicialização.
   */
  afterStart?(kernel: Kernel): Promise<void> | void;

  /**
   * Hook de finalização graciosa.
   */
  shutdown?(kernel: Kernel): Promise<void> | void;
}
