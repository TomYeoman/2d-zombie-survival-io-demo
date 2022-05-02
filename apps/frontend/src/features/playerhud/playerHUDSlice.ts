import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import HudUpdateMessage from '@io/common/message/HudUpdateMessage';
import { RootState, AppThunk } from '../../app/store';

export interface PlayerHUD extends HudUpdateMessage{}

const initialState: PlayerHUD = {
  // Player
   health: 100,
   ammo: "",
  gunName: "",
  // Game
  currentWave: 0,
  waveSize: 0,
  zombiesRemaining: 0,
  zombiesKilled: 0,
  zombiesAlive: 0,
  playersAlive: 0,
  playersTotal: 0,
  gameStatus : "N/A"
};


export const playerHUDSlice = createSlice({
  name: 'gameinfo',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updatePlayerHUD: (state, action: PayloadAction<PlayerHUD>) => {

      console.log({action})
      return {...state, ...action.payload}
    },
  },
});

export const { updatePlayerHUD } = playerHUDSlice.actions;

export default playerHUDSlice.reducer;