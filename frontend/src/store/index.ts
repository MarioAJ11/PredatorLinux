import { configureStore } from '@reduxjs/toolkit';
import statsReducer from './slices/statsSlice';
import profilesReducer from './slices/profilesSlice';
import fansReducer from './slices/fansSlice';

export const store = configureStore({
  reducer: {
    stats: statsReducer,
    profiles: profilesReducer,
    fans: fansReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
