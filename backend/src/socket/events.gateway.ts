import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3011)  
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;  

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('broadcast')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket,) {
    console.log(`Message received: ${data}`);
    client.broadcast.emit('broadcast', data);

    return { event: 'broadcast', data: data };
  }

  @SubscribeMessage('create_lobby')
  createGame(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const gameCode = "fdsa-fdhs-pods"
    console.log(`Game created: ${gameCode}`);
    client.join(gameCode);
  }

  @SubscribeMessage('lobby_update')
  lobbyUppdate(@MessageBody() data: { gameCode: string; data: any }, @ConnectedSocket() client: Socket) {
    console.log(`Lobby update for game ${data.gameCode}: ${data}`);
    client.to(data.gameCode).emit('lobby_update', data);
    return { event: 'lobby_update', data: data };
  }
  
  @SubscribeMessage('join_lobby')
  joinGame(@MessageBody() data: { gameCode:string }, @ConnectedSocket() client: Socket) {
    client.join(data.gameCode);
    console.log(`Client ${client.id} joined lobby: ${data.gameCode}`);
  }

  @SubscribeMessage('start_game')
  startGame(@MessageBody() data: { gameCode: string }, @ConnectedSocket() client: Socket) {
    console.log(`Game started: ${data.gameCode}`);
    client.to(data.gameCode).emit('game_started', data.gameCode);
  }

  @SubscribeMessage('game_update')
  gameUpdate(@MessageBody() data: { gameCode: string; data: any }, @ConnectedSocket() client: Socket) {
    console.log(`Game update for game ${data.gameCode}: ${data}`);
    client.to(data.gameCode).emit('game_update', data);
    return { event: 'game_update', data: data };
  }

  @SubscribeMessage('pos_update')
  posUpdate(@MessageBody() data: { gameCode: string; userId: string, pos: any }, @ConnectedSocket() client: Socket) {
    console.log(`Position update for player ${data.userId}: ${data.pos}`);
    client.to(data.gameCode).emit('pos_update', data);
    return { event: 'pos_update', data: data };
  }

  @SubscribeMessage('leave_game')
  leaveGame(@MessageBody() gameCode: string, @ConnectedSocket() client: Socket) {
    client.leave(gameCode);
    console.log(`Client ${client.id} left room: ${gameCode}`);
    client.emit('left_room', gameCode);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { gameCode: string; message: string }, @ConnectedSocket() client: Socket) {
    console.log(`Message received in room ${data.gameCode}: ${data.message}`);
    client.to(data.gameCode).emit('message', data.message);
    return { event: 'message', data: data };
  }
}

