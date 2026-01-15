import { RealtimePort } from '../../kernel/ports/RealtimePort';
import { createClient, RedisClientType } from 'redis';

export class RedisPubSub implements RealtimePort {
  private pub: RedisClientType;

  constructor() {
    const host = process.env.REDIS_HOST ?? '127.0.0.1';
    const port = Number(process.env.REDIS_PORT ?? 6379);

    console.log('🔌 Conectando Redis em', host, port);

    this.pub = createClient({
      socket: { host, port },
    });

    // conecta async e aguarda erros
    this.pub.connect()
      .then(() => console.log('🟢 Redis Pub conectado'))
      .catch(err => {
        console.error('❌ Redis error', err);
        process.exit(1); // encerra se não conseguir conectar
      });
  }

  async broadcast(event: string, payload: unknown): Promise<void> {
    if (!this.pub.isOpen) {
      console.warn('⚠️ Redis Pub não está conectado, tentando reconectar...');
      await this.pub.connect();
    }
    await this.pub.publish(event, JSON.stringify(payload));
  }

  async connect(): Promise<void> {
    if (!this.pub.isOpen) await this.pub.connect();
  }
}
