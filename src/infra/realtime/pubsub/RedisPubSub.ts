import { RealtimePort } from '../../../kernel/ports/RealtimePort';
import { createClient } from 'redis';

export class RedisPubSub implements RealtimePort {
  private pub;

  constructor() {
    const host = process.env.REDIS_HOST ?? '127.0.0.1';
    const port = Number(process.env.REDIS_PORT ?? 6379);

    console.log('🔌 Conectando Redis em', host, port);

    this.pub = createClient({
      socket: { host, port },
    });

    this.pub.connect()
      .then(() => console.log('🟢 Redis Pub conectado'))
      .catch(err => console.error('❌ Redis error', err));
  }

  async broadcast(event: string, payload: unknown): Promise<void> {
    await this.pub.publish(event, JSON.stringify(payload));
  }
}
