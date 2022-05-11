import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';

export interface DebugBar {
  debugInfo: number;
  killFlag: boolean;
}

const initialState: DebugBar = {
  debugInfo: 0,
  killFlag: false,
};

export const debugBarSlice = createSlice({
  name: 'debugSlice',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

    clickKillButton: (state, action) => {
      state.killFlag = !state.killFlag;
    },
  },
});

export const {clickKillButton } = debugBarSlice.actions;

// export const changeToSlot = (index: number) => {
//     changeDebugInfo(index)
// }

// export const clickKillButtonActtion = () => {
//   clickKillButton(true)
// }

export default debugBarSlice.reducer;