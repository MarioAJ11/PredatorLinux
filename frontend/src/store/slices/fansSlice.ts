import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FanType } from '@/types';

interface FanState {
  cpuSpeed: number;
  gpuSpeed: number;
  autoMode: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: FanState = {
  cpuSpeed: 50,
  gpuSpeed: 50,
  autoMode: true,
  loading: false,
  error: null,
};

const fansSlice = createSlice({
  name: 'fans',
  initialState,
  reducers: {
    setFanSpeedStart(state) {
      state.loading = true;
      state.error = null;
    },
    setFanSpeedSuccess(state, action: PayloadAction<{ fan: FanType; speed: number }>) {
      state.loading = false;
      const { fan, speed } = action.payload;
      if (fan === 'cpu') {
        state.cpuSpeed = speed;
      } else {
        state.gpuSpeed = speed;
      }
      state.autoMode = false;
    },
    setFanSpeedFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setAutoModeStart(state) {
      state.loading = true;
      state.error = null;
    },
    setAutoModeSuccess(state) {
      state.loading = false;
      state.autoMode = true;
    },
    setAutoModeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setFanSpeedStart,
  setFanSpeedSuccess,
  setFanSpeedFailure,
  setAutoModeStart,
  setAutoModeSuccess,
  setAutoModeFailure,
} = fansSlice.actions;

export default fansSlice.reducer;
