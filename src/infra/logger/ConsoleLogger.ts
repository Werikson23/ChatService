import { LoggerPort } from '../../kernel/ports/LoggerPort';

export class ConsoleLogger implements LoggerPort {
  info(message: string, meta?: unknown): void {
    console.log(`ℹ️  ${message}`, meta ?? '');
  }

  warn(message: string, meta?: unknown): void {
    console.warn(`⚠️  ${message}`, meta ?? '');
  }

  error(message: string, meta?: unknown): void {
    console.error(`❌ ${message}`, meta ?? '');
  }
}
