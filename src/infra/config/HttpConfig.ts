export class HttpConfig {
  static readonly host = process.env.HTTP_HOST ?? '0.0.0.0';

  static readonly port = Number(process.env.HTTP_PORT ?? 3000);
}
