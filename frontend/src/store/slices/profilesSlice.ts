import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PerformanceMode } from '@/types';

interface ProfileState {
  currentMode: PerformanceMode;
  turboEnabled: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  currentMode: 'balanced',
  turboEnabled: false,
  loading: false,
  error: null,
};

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setModeStart(state) {
      state.loading = true;
      state.error = null;
    },
    setModeSuccess(state, action: PayloadAction<PerformanceMode>) {
      state.loading = false;
      state.currentMode = action.payload;
    },
    setModeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setTurboStart(state) {
      state.loading = true;
      state.error = null;
    },
    setTurboSuccess(state, action: PayloadAction<boolean>) {
      state.loading = false;
      state.turboEnabled = action.payload;
    },
    setTurboFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setModeStart,
  setModeSuccess,
  setModeFailure,
  setTurboStart,
  setTurboSuccess,
  setTurboFailure,
} = profilesSlice.actions;

export default profilesSlice.reducer;
