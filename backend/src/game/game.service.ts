import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from './models/game.model';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private userModel: Model<Game>) {}

  // === General ===
  async findGame(): Promise<any> { 
    return {}; 
  }
  async findGameLog(): Promise<any> { 
    return {}; 
  }

  // === Lobby ===
  async createLobby(): Promise<any> { 
    return {}; 
  }
  async updateLobby(): Promise<any> { 
    return {}; 
  }
  async joinLobby(): Promise<any> { 
    return {}; 
  }
  async leaveLobby(): Promise<any> { 
    return {}; 
  }

  // === Game ===
  async startGame(): Promise<any> { 
    return {}; 
  }
  async updateGame(): Promise<any> { 
    return {}; 
  }
  async updatePos(): Promise<any> { 
    return {}; 
  }
  async leavePos(): Promise<any> { 
    return {}; 
  }

  // === Populate ===
  async populateByUser(): Promise<any> { 
    return {}; 
  }
  async populateByGameLog(): Promise<any> { 
    return {}; 
  }

}
