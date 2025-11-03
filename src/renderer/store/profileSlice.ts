import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PerformanceProfile } from '../../types';

interface ProfileState {
  profiles: PerformanceProfile[];
  activeProfileId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profiles: [],
  activeProfileId: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfiles(state, action: PayloadAction<PerformanceProfile[]>) {
      state.profiles = action.payload;
    },
    setActiveProfile(state, action: PayloadAction<string>) {
      state.activeProfileId = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setProfiles, setActiveProfile, setLoading, setError } = profileSlice.actions;
export default profileSlice.reducer;
