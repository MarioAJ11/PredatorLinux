/**
 * Tipos para el sistema de control de hardware
 */

export type PerformanceMode = 'turbo' | 'quiet' | 'balanced' | 'performance';

export interface SystemStats {
  cpuTemp: number;
  gpuTemp: number;
  systemTemp: number;
  fan1Rpm: number;
  fan2Rpm: number;
  cpuUsage: number;
  gpuUsage: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
