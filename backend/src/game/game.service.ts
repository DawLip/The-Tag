import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Socket } from 'socket.io';

import { JoinGameInput } from 'src/game/dto/game.input';

import { Game, GameLog } from './models/game.model';
import { gameDefault } from './models/gameDefaults';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(GameLog.name) private gameLogModel: Model<GameLog>,
    private usersService: UsersService,
  ) {}

  // === General ===
  async findGame(_id: Types.ObjectId): Promise<any> { 
    console.log(`Find game ${_id}`);
    const game = await this.gameModel.findOne({ _id }).exec();
    return game
  }
  async findGameLog(_id: Types.ObjectId): Promise<any> { 
    return await this.gameLogModel.findOne({ _id }).exec();
  }
  generateGameCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let gameCode = '';
    for (let i = 0; i < 3; i++) {
      for (let i = 0; i < 4; i++) {
        gameCode += characters[Math.floor(Math.random() * characters.length)];
      }
      if(i!=2) gameCode += '-';
    }
    
    return gameCode;
  }

  // === Lobby ===
  async createLobby(data, creatorId, client): Promise<any> { 
    const gameCode = this.generateGameCode();
    const createdLobby = new this.gameModel(gameDefault(gameCode,data.name, creatorId));
    console.log(`Created lobby ${createdLobby._id}`);
    client.join(gameCode);
    const game = (await createdLobby.save()).toObject();
  
    return { status: 'SUCCESS', game: await this.populatePlayers(game) };
  }
  async updateLobby({ toChange, gameCode }, client): Promise<any> {
    console.log("=== updateLobby ===");
    const lobby = await this.gameModel.findOne({ gameCode: gameCode });
    
    if (!lobby) {console.error("Error: game not found"); return { status: "ERROR", msg:"game not found" };}
    // client.join(gameCode);
    
    console.log(`${Date.now()} [WS] Emitting 'lobby_update' to ${gameCode}:`, { toChange });
    client.emit('lobby_update', { toChange, gameCode }); 
    client.to(gameCode).emit('lobby_update', { toChange, gameCode });
    for (const key in toChange) {
      if (key !== '_id') {
        lobby[key] = toChange[key];
      }
    }
    
    await lobby.save();
  }
  async updateLobbySettings({ toChange, gameCode }, client): Promise<any> {
    const lobby = await this.gameModel.findOne({ gameCode: gameCode });
    
    if (!lobby) return { status: "ERROR", msg:"game not found" }

    for (const key in toChange) {
      if (key !== '_id') {
        lobby.settings[key] = toChange[key];
      }
    }
    await lobby.save();

    return lobby;
  }
  async joinLobby({gameCode, _id}:JoinGameInput, client): Promise<any> { 
    console.log(`User ${_id} pretends to join lobby ${gameCode}`);
    const lobby = await this.gameModel.findOne({gameCode});

    if(!lobby) return { status:"ERROR", msg:"game not found" }
    if(!_id) return { status:"ERROR", msg:"_id must be passed"}

    client.join(gameCode);
    client.to(gameCode).emit('user_joined', { 
      ...(await this.usersService.findOneById(_id)).toObject(),
      role: 0
     });

    lobby.players.push({ playerId: _id, role: 0 });
    const game = (await lobby.save()).toObject();

    console.log(`success`)
    return { status: 'SUCCESS', game: await this.populatePlayers(game) };
  }
  async leaveLobby({gameCode, _id}:JoinGameInput): Promise<any> { 
    console.log(`User ${_id} pretends to leave lobby ${gameCode}`);
    const lobby = await this.gameModel.findOne({gameCode});

    if(!lobby) return { status:"ERROR", msg:"game not found" }
    if(!_id) return {status:"ERROR", msg:"_id must be passed"}

    // lobby.spectators = lobby.spectators.filter(s => s!=_id);
    lobby.save();

    return { status:"SUCCESS" }; 
  }

  // === Game ===
  async startGame({gameCode}:{gameCode:string}, client:Socket): Promise<any> { 
    console.log(`Game  ${gameCode} started`);
    const game = await this.gameModel.findOne({gameCode});

    if(!game) return { status:"ERROR", msg:"game not found" }
    game.status="STARTED";
    await game.save();
    console.log("success");
    client.to(gameCode).emit('game_started', { gameCode });
  }
  async updateGame(data): Promise<any> { 
    return {}; 
  }
  async updatePos({gameCode, userId, pos}, client:Socket): Promise<any> { 
    console.log(`User ${userId} update pos: ${pos}`);
    const game = await this.gameModel.findOne({gameCode});

    if(!game) return { status:"ERROR", msg:"game not found" }
    if(!userId) return {status:"ERROR", msg:"_id must be passed"}

    client.broadcast.to(gameCode).emit('pos_update', { gameCode, userId, pos });
  }
  async leavePos(data): Promise<any> { 
    return {}; 
  }

  // === Populate ===
  async populatePlayers(game): Promise<any> {
    const populatedPlayers = await Promise.all(
      game.players.map(async (player) => ({
        ...(await this.usersService.findOneById(player.playerId)).toObject(),
        role: player.role,
      })
    ));
  
    return {...game, players: populatedPlayers};
  }
  async populateByGameLog(data): Promise<any> { 
    return {}; 
  }

}
