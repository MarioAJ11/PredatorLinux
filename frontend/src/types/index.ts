export interface SystemStats {
  cpu: {
    temperature: number;
    usage: number;
  };
  gpu: {
    temperature: number;
    usage: number;
    vram: {
      used: number;
      total: number;
    };
  };
  fans: {
    cpu: number;
    gpu: number;
  };
}

export type PerformanceMode = 'turbo' | 'performance' | 'balanced' | 'quiet';

export type FanType = 'cpu' | 'gpu';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
