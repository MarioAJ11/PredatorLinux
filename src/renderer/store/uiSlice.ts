import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  guardianWarning: string | null;
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    timestamp: number;
  }>;
}

const initialState: UiState = {
  guardianWarning: null,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGuardianWarning(state, action: PayloadAction<string | null>) {
      state.guardianWarning = action.payload;
    },
    addNotification(state, action: PayloadAction<Omit<UiState['notifications'][0], 'id' | 'timestamp'>>) {
      state.notifications.push({
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { setGuardianWarning, addNotification, removeNotification, clearNotifications } = uiSlice.actions;
export default uiSlice.reducer;
