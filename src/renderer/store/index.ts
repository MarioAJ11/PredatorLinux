import { configureStore } from '@reduxjs/toolkit';
import statsReducer from './statsSlice';
import profileReducer from './profileSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    stats: statsReducer,
    profile: profileReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
