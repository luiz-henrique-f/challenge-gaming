import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: any) {
    const userId = socket.handshake.query.userId;
    console.log(`Cliente conectado: ${userId}`);
    socket.join(`user_${userId}`);
  }

  notifyUser(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notification', notification);
  }
}
