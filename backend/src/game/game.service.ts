import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { JoinGameInput } from 'src/game/dto/game.input';

import { Game, GameLog } from './models/game.model';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(GameLog.name) private gameLogModel: Model<GameLog>,
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
  async createLobby(creatorId): Promise<any> { 
    const createdLobby = new this.gameModel({
      name: 'New lobby',
      description: 'Lobby for the game',
      gameCode: this.generateGameCode(),
      status: 'LOBBY',
      rules: [],
      owner: creatorId,
      gameMaster: null,
      spectators: [creatorId],
      players: [],
      gameLogs: [],
    });
    console.log(`Created lobby ${createdLobby._id}`);
    return createdLobby.save();
  }
  async updateLobby({ toChange, gameCode }): Promise<any> {
    const lobby = await this.gameModel.findOne({ gameCode: gameCode });
    
    if (!lobby) return { status: "ERROR", msg:"game not found" }

    for (const key in toChange) {
      if (key !== '_id') {
        lobby[key] = toChange[key];
      }
    }
    
    await lobby.save();
    return lobby;
  }
  async joinLobby({gameCode, _id}:JoinGameInput): Promise<any> { 
    console.log(`User ${_id} pretends to join lobby ${gameCode}`);
    const lobby = await this.gameModel.findOne({gameCode});

    if(!lobby) return { status:"ERROR", msg:"game not found" }
    if(!_id) return {status:"ERROR", msg:"_id must be passed"}

    lobby.spectators.push(_id);
    lobby.save();

    console.log(`success`)
    return { status:"SUCCESS" }; 
  }
  async leaveLobby({gameCode, _id}:JoinGameInput): Promise<any> { 
    console.log(`User ${_id} pretends to leave lobby ${gameCode}`);
    const lobby = await this.gameModel.findOne({gameCode});

    if(!lobby) return { status:"ERROR", msg:"game not found" }
    if(!_id) return {status:"ERROR", msg:"_id must be passed"}

    lobby.spectators = lobby.spectators.filter(s => s!=_id);
    lobby.save();

    return { status:"SUCCESS" }; 
  }

  // === Game ===
  async startGame(data): Promise<any> { 
    return {}; 
  }
  async updateGame(data): Promise<any> { 
    return {}; 
  }
  async updatePos(data): Promise<any> { 
    return {}; 
  }
  async leavePos(data): Promise<any> { 
    return {}; 
  }

  // === Populate ===
  async populateByUser(data): Promise<any> { 
    return {}; 
  }
  async populateByGameLog(data): Promise<any> { 
    return {}; 
  }

}
