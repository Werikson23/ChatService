import { EventBus } from '../kernel/EventBus';
import { RealtimeBridge } from '../realtime/RealtimeBridge';
import { SocketRealtime } from '../realtime/SocketRealtime';
import { Server } from 'socket.io';

export function bootstrapRealtime(
  eventBus: EventBus,
  io: Server
) {
  const realtime = new SocketRealtime(io);
  const bridge = new RealtimeBridge(eventBus, realtime);

  // eventos que vão para realtime
  bridge.bindEvent('user.logged_in');
  bridge.bindEvent('ticket.created');

  console.log('🔁 EventBus conectado ao Realtime');
}
