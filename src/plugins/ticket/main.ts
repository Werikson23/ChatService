import { IPlugin } from '../../kernel/IPlugin';
import { Kernel } from '../../kernel/Kernel';

export default class TicketPlugin implements IPlugin {
  name = 'TicketPlugin';
  version = '1.0.0';

  register(kernel: Kernel): void {
    kernel.getLogger()?.info?.(`🎫 ${this.name} registrado`);
  }

  async start(kernel?: Kernel): Promise<void> {
    kernel?.getLogger()?.info?.(`🚀 ${this.name} iniciado`);
  }
}
