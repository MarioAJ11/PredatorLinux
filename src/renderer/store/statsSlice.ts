import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SystemStats } from '../../types';

interface StatsState {
  current: SystemStats | null;
  history: SystemStats[];
  maxHistory: number;
}

const initialState: StatsState = {
  current: null,
  history: [],
  maxHistory: 60, // Mantener 60 mediciones (2 minutos)
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStats(state, action: PayloadAction<SystemStats>) {
      state.current = action.payload;
      
      // Agregar al historial
      state.history.push(action.payload);
      
      // Mantener solo las últimas N mediciones
      if (state.history.length > state.maxHistory) {
        state.history.shift();
      }
    },
    clearHistory(state) {
      state.history = [];
    },
  },
});

export const { setStats, clearHistory } = statsSlice.actions;
export default statsSlice.reducer;
