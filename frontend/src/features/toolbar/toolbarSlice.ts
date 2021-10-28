import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';

export interface Toolbar {
  selectedSlot: number;
  slotData: ToolbarSlot[];
}

type ToolbarSlot = {
    name: string;
    image: string;
}

const initialState: Toolbar = {
  selectedSlot: 0,
    slotData: [
        {
            name: "pistol", image: "./toolbar-pistol.png"
        },
        {
            name: "smg", image: "./toolbar_smg.png"
        },
        {
            name: "", image: ""
        },
        {
            name: "", image: ""
        },
    ],
};

export const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    changeSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
  },
});

export const { changeSlot } = toolbarSlice.actions;

export const changeToSlot = (index: number) => {
    changeSlot(index)
}

export default toolbarSlice.reducer;