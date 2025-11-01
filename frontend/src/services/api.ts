import axios from 'axios';
import type { ApiResponse, SystemStats, PerformanceMode, FanType } from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

export const statsApi = {
  getStats: async (): Promise<SystemStats> => {
    const { data } = await api.get<ApiResponse<SystemStats>>('/stats');
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch stats');
    }
    return data.data;
  },
};

export const profilesApi = {
  setTurboMode: async (enable: boolean): Promise<void> => {
    const { data } = await api.post<ApiResponse>('/profiles/turbo', { enable });
    if (!data.success) {
      throw new Error(data.error || 'Failed to set turbo mode');
    }
  },

  setPerformanceMode: async (mode: PerformanceMode): Promise<void> => {
    const { data } = await api.post<ApiResponse>('/profiles/mode', { mode });
    if (!data.success) {
      throw new Error(data.error || 'Failed to set performance mode');
    }
  },
};

export const fansApi = {
  setFanSpeed: async (fan: FanType, speed: number): Promise<void> => {
    const { data } = await api.post<ApiResponse>('/fans/speed', { fan, speed });
    if (!data.success) {
      throw new Error(data.error || 'Failed to set fan speed');
    }
  },

  setAutoMode: async (): Promise<void> => {
    const { data } = await api.post<ApiResponse>('/fans/auto');
    if (!data.success) {
      throw new Error(data.error || 'Failed to set auto mode');
    }
  },
};
