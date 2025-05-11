import { Socket } from 'socket.io-client';

export type PlayerPosition = {
  userId: string;
  latitude: number;
  longitude: number;
};

export type SimplifiedPlayer = {
  latitude: number;
  longitude: number;
  type: 'hider';
};

type Callback = (players: SimplifiedPlayer[]) => void;

class PlayerPositionManager {
  private players: PlayerPosition[] = [];
  private socket: Socket | null = null;
  private currentUserId: string = '';
  private updateCallbacks: Callback[] = [];

  init(socket: Socket, userId: string) {
    this.socket = socket;
    this.currentUserId = userId;

    socket.on('pos_update', (data: PlayerPosition) => {
      this.updatePlayer(data);
      this.notify();
    });
  }

  sendMyPosition(latitude: number, longitude: number) {
    if (!this.socket || !this.currentUserId) return;
    this.socket.emit('pos_update', {
      userId: this.currentUserId,
      latitude,
      longitude,
    });
  }

  private updatePlayer(data: PlayerPosition) {
    const index = this.players.findIndex(p => p.userId === data.userId);
    if (index !== -1) {
      this.players[index] = data;
    } else {
      this.players.push(data);
    }
  }

  private getOtherPlayers(): SimplifiedPlayer[] {
    return this.players
      .filter(p => p.userId !== this.currentUserId)
      .map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
        type: 'hider',
      }));
  }

  onUpdate(callback: Callback) {
    this.updateCallbacks.push(callback);
  }

  private notify() {
    const others = this.getOtherPlayers();
    this.updateCallbacks.forEach(cb => cb(others));
  }
}

export const playerPositionManager = new PlayerPositionManager();