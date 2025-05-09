import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  name: string;
  description: string;
  status: string;
  gameCode: string;
  rules: string[];
  settings: Record<string, any>;
  events: Record<string, any>;
  owner: string;
  gameMaster: string | null;
  spectators: any[];
  players: any[]; // Można to zastąpić np. Player[] jeśli masz interfejs
  gameLogs: any[];
}

const initGameState: GameState = {
  name: 'New lobby',
  description: 'Lobby',
  status: 'NOT_SELECTED',
  gameCode: '',
  rules: [],
  settings: {},
  events: {},
  owner: '',
  gameMaster: null,
  spectators: [],
  players: [],
  gameLogs: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState: initGameState,
  reducers: {
    joinLobby: (state, action: PayloadAction<GameState>) => {
      return action.payload;
    },
    userJoined: (state, action: PayloadAction<any>) => {
      state.players.push(action.payload);
    },
    gameStarted: (state, action: PayloadAction<any>) => {
      state.status = 'STARTED';
    },
  },
});

export const { joinLobby, userJoined, gameStarted } = gameSlice.actions;
export default gameSlice.reducer;