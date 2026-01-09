import { Kernel } from './Kernel';

export interface IPlugin {
  name: string;
  version: string;

  /**
   * Método chamado quando o plugin é registrado no kernel.
   */
  register(kernel: Kernel): void;

  /**
   * Método chamado para iniciar o plugin (assíncrono)
   */
  start?(): Promise<void>;
}
