/** Estadísticas en tiempo real del sistema */
export interface SystemStats {
  cpuTemp: number;
  gpuTemp: number;
  systemTemp: number;
  fan1Rpm: number;
  fan2Rpm: number;
  cpuUsage: number;
  gpuUsage: number;
  timestamp: number;
}

/** Configuración de iluminación RGB */
export interface RgbConfig {
  mode: 'static' | 'wave' | 'breathing' | 'off';
  speed: number; // 1-5
  color: string; // hex, ej. '#FF0000'
}

/** Definición de un perfil de rendimiento completo */
export interface PerformanceProfile {
  id: 'quiet' | 'balanced' | 'performance';
  name: string; // "Silencioso"
  turboMode: boolean; // ¿Modo Turbo activado?
  fanMode: 'auto' | 'manual';
  fanSpeed?: number; // % (solo si fanMode es 'manual')
  cpuGovernor: 'powersave' | 'balanced' | 'performance';
  rgbConfig: RgbConfig; // Configuración RGB para este perfil
}

/** Tipos de ventilador */
export type FanType = 'cpu' | 'gpu';

/** Modos de control de ventilador */
export type FanMode = 'auto' | 'manual';
