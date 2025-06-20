import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';
import { AuthService } from 'src/auth/auth.service';
import { JoinGameInput } from 'src/game/dto/game.input';
import config from '@/../config';

@WebSocketGateway(3011)  
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;  

  constructor(
    private gameService: GameService,
    private authService: AuthService
  ) {}

  afterInit() {
    console.log('WebSocket server initialized');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth?.token?.replace(/^Bearer /, "") || "";
    const payload = await this.authService.verify(token);
    console.log(`Client attempt to connect: ${client.id}`);
    if (!payload) {
      console.log(`Client failed to connect: ${client.id}`);
      client.disconnect();
      return;
    }
    console.log(`Client connected: ${client.id}`);
    client.data.user = payload;
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('create_lobby')
  createGame(@MessageBody() data, @ConnectedSocket() client: Socket) {
    return this.gameService.createLobby(data, client.data.user._id, client);
  }

  @SubscribeMessage('lobby_update')
  lobbyUppdate(@MessageBody() data: { gameCode: string; toChange: any }, @ConnectedSocket() client: Socket) {
    return this.gameService.updateLobby(data, client);
  }
  
  @SubscribeMessage('join_lobby')
  joinGame(@MessageBody() data: JoinGameInput, @ConnectedSocket() client: Socket) {
    return this.gameService.joinLobby({_id: client.data.user._id, ...data}, client);
  }
  @SubscribeMessage('leave_lobby')
  leaveLobby(@MessageBody() data: JoinGameInput, @ConnectedSocket() client: Socket) {
    return this.gameService.leaveLobby({_id: data._id || client.data.user._id, ...data}, client);
  }

  @SubscribeMessage('leave_lobby_room')
  leaveLobbyRoom(@MessageBody() data: JoinGameInput, @ConnectedSocket() client: Socket) {
    return this.gameService.leaveLobbyRoom(data, client);
  }

  @SubscribeMessage('start_game')
  startGame(@MessageBody() data: { gameCode: string }, @ConnectedSocket() client: Socket) {
    return this.gameService.startGame(data, client);
  }

  @SubscribeMessage('game_update')
  gameUpdate(@MessageBody() data: { gameCode: string; toChange: any }, @ConnectedSocket() client: Socket) {
    return this.gameService.updateGame(data, client);
  }

  @SubscribeMessage('pos_update')
  posUpdate(@MessageBody() data: { gameCode: string; userId: string, pos: any }, @ConnectedSocket() client: Socket) {
    return this.gameService.updatePos(data, client);
  }

  @SubscribeMessage('leave_game')
  leaveGame(@MessageBody() gameCode: string, @ConnectedSocket() client: Socket) {
    return this.gameService.leaveLobby({gameCode}, client);
  }

  // === Other events ===
  @SubscribeMessage('broadcast')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket,) {
    console.log(`Message received: ${data}`);
    client.broadcast.emit('broadcast', data);

    return { event: 'broadcast', data: data };
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { gameCode: string; message: string }, @ConnectedSocket() client: Socket) {
    console.log(`Message received in room ${data.gameCode}: ${data.message}`);
    client.to(data.gameCode).emit('message', data.message);
    return { event: 'message', data: data };
  }
}

