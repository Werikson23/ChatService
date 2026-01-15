import { RedisPubSub } from '../realtime/pubsub/RedisPubSub';
import { redisClient } from '../infra/cache/redis/redisClient';

export interface InfraContext {
  pubsub: RedisPubSub;
}

export async function bootstrapInfra(): Promise<InfraContext> {
  console.log('🔌 Inicializando infraestrutura...');

  try {
    // força conexão Redis e verifica saúde
    await redisClient.ping();
    console.log('🟢 Redis pronto');
  } catch (err) {
    console.error('❌ Falha ao conectar no Redis', err);
    process.exit(1); // encerra se não conseguir conectar
  }

  // Inicializa Pub/Sub, mas aguarda conexão antes de retornar
  const pubsub = new RedisPubSub();
  try {
    await pubsub.connect(); // método async que conecta RedisPubSub
    console.log('🟣 Redis Pub/Sub pronto');
  } catch (err) {
    console.error('❌ Falha ao iniciar Redis Pub/Sub', err);
    process.exit(1);
  }

  return { pubsub };
}
