import { Server } from 'socket.io';
import { RealtimePort } from '../../kernel/ports/RealtimePort';

export class SocketRealtime implements RealtimePort {
  constructor(private readonly io: Server) {}

  async broadcast(event: string, payload: unknown) {
    this.io.emit(event, payload);
  }
}
