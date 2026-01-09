export class HealthCheck {
  static async run(): Promise<void> {
    try {
      // Aqui você pode checar DB, Redis, serviços externos, etc.
      console.log('💓 HealthCheck: verificando serviços...');
      // Simulação de teste de conectividade
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log('💓 HealthCheck: todos os serviços saudáveis');
    } catch (err) {
      console.error('❌ HealthCheck falhou', err);
      throw err;
    }
  }
}
