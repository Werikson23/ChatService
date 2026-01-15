import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

export const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,

  // ⏱️ timeout de conexão
  connectTimeout: 10_000,

  // 🔁 reconexão automática
  retryStrategy(times) {
    const delay = Math.min(times * 1000, 10_000);
    console.warn(`🔁 Redis reconectando em ${delay}ms (tentativa ${times})`);
    return delay;
  },

  // 🧠 evita travar app se Redis cair
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redisClient.on('connect', () => {
  console.log(`🟢 Redis conectado (${REDIS_HOST}:${REDIS_PORT})`);
});

redisClient.on('ready', () => {
  console.log('🟣 Redis pronto para uso');
});

redisClient.on('reconnecting', () => {
  console.warn('🟡 Redis reconectando...');
});

redisClient.on('close', () => {
  console.warn('🔌 Redis conexão fechada');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
  // ❌ NÃO mata o processo aqui
});
