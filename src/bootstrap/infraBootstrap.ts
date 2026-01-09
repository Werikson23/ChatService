import { RedisPubSub } from '../infra/realtime/pubsub/RedisPubSub';
import { redisClient } from '../infra/cache/redis/redisClient';

export interface InfraContext {
  pubsub: RedisPubSub;
}

export async function bootstrapInfra(): Promise<InfraContext> {
  console.log('🔌 Inicializando infraestrutura...');

  // força conexão Redis
  await redisClient.ping();
  console.log('🟢 Redis pronto');

  const pubsub = new RedisPubSub();
  console.log('🟣 Redis Pub/Sub pronto');

  return {
    pubsub,
  };
}
