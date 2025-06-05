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
  players: any[]; 
  gameLogs: any[];
  roles:any[]
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
  roles: []
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
    lobbyUpdate: (state:any, action: PayloadAction<any>) => {
      console.log('lobbyUpdate gameslice');
      for (const key in action.payload.toChange) {
        if (key !== '_id') {
          state[key] = action.payload.toChange[key];
        }
      }
    },
    addLog: (state, action: PayloadAction<any>) => {
      state.gameLogs = [...state.gameLogs, {
        date: Date.now(),
        yourRole:  state.roles[state.players.filter((p:any)=>p._id==action.payload.userId)[0]?.role].name,
        playersRemaining:state.players.filter((p:any)=>p.role==2).length,
        ...action.payload
      }]
    },
  },
});

export const { joinLobby, userJoined, gameStarted, lobbyUpdate, addLog } = gameSlice.actions;
export default gameSlice.reducer;