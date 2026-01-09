import { EventBus } from '../../kernel/EventBus';
import { RealtimePort } from '../../kernel/ports/RealtimePort';

export class RealtimeBridge {
  constructor(
    private readonly eventBus: EventBus,
    private readonly realtime: RealtimePort
  ) {}

  bind() {
    this.eventBus.on('*', async (payload) => {
      // wildcard opcional (explico abaixo)
    });
  }

  bindEvent(event: string) {
    this.eventBus.on(event, async (payload) => {
      await this.realtime.broadcast(event, payload);
    });
  }
}
