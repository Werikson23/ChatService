import { LoggerPort } from '../kernel/ports/LoggerPort';
import { ConsoleLogger } from '../infra/logger';

export function createLogger(): LoggerPort {
  return new ConsoleLogger();
}
