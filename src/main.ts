import { bootstrap } from './bootstrap/bootstrap';

bootstrap().catch(err => {
  console.error('❌ Falha ao iniciar aplicação', err);
  process.exit(1);
});
