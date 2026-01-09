export class AppConfig {
  static readonly appName = process.env.APP_NAME ?? 'app';
  static readonly version = process.env.APP_VERSION ?? '0.0.0';

  static readonly env = (process.env.NODE_ENV ?? 'development') as
    | 'development'
    | 'test'
    | 'staging'
    | 'production';

  static isProd() {
    return this.env === 'production';
  }
}
