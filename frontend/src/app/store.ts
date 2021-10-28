import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import toolbarReducer from '../features/toolbar/toolbarSlice';
import playerHudReducer from '../features/playerhud/playerHUDSlice';
import debugReducer from '../features/debugbar/debugbarSlice';

export const store = configureStore({
  reducer: {
    toolbar: toolbarReducer,
    playerHUD: playerHudReducer,
    debugBar: debugReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;