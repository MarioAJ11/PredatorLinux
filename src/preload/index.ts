import { contextBridge, ipcRenderer } from 'electron';
import type { SystemStats, RgbConfig, PerformanceProfile, FanType } from '../types';

// Expone la API de Electron al frontend de forma segura
contextBridge.exposeInMainWorld('electronAPI', {
  // --- Funciones que React puede 'invocar' (llamar) ---
  
  /**
   * Aplica un perfil de rendimiento completo
   */
  applyProfile: (profile: PerformanceProfile): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('profile:apply', profile),

  /**
   * Obtiene los perfiles predefinidos
   */
  getDefaultProfiles: (): Promise<PerformanceProfile[]> =>
    ipcRenderer.invoke('profile:get-defaults'),
    
  /**
   * Establece una configuración RGB específica
   */
  setRgb: (config: RgbConfig): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('rgb:set', config),

  /**
   * Establece una velocidad de ventilador manual (anula el perfil)
   */
  setManualFanSpeed: (fan: FanType, speed: number): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('fans:set-manual', fan, speed),

  /**
   * Activa el modo automático de ventiladores
   */
  setAutoFanMode: (): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('fans:set-auto'),

  /**
   * Activa o desactiva el modo Turbo
   */
  setTurboMode: (enable: boolean): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('turbo:set', enable),

  // --- Eventos que React puede 'escuchar' ---
  
  /**
   * Escucha las actualizaciones de estadísticas (temp, rpm)
   * que envía el proceso Main cada segundo.
   */
  onStatsUpdate: (callback: (stats: SystemStats) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, stats: SystemStats) => callback(stats);
    ipcRenderer.on('stats:update', listener);
    
    // Retorna función de limpieza
    return () => {
      ipcRenderer.removeListener('stats:update', listener);
    };
  },

  /**
   * Escucha los eventos del Guardián de Seguridad
   * (ej. sobrecalentamiento detectado).
   */
  onGuardianEvent: (callback: (message: string) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, message: string) => callback(message);
    ipcRenderer.on('guardian:event', listener);
    
    return () => {
      ipcRenderer.removeListener('guardian:event', listener);
    };
  },
});

// Declarar los tipos globales para TypeScript
declare global {
  interface Window {
    electronAPI: {
      applyProfile: (profile: PerformanceProfile) => Promise<{ success: boolean; error?: string }>;
      getDefaultProfiles: () => Promise<PerformanceProfile[]>;
      setRgb: (config: RgbConfig) => Promise<{ success: boolean; error?: string }>;
      setManualFanSpeed: (fan: FanType, speed: number) => Promise<{ success: boolean; error?: string }>;
      setAutoFanMode: () => Promise<{ success: boolean; error?: string }>;
      setTurboMode: (enable: boolean) => Promise<{ success: boolean; error?: string }>;
      onStatsUpdate: (callback: (stats: SystemStats) => void) => () => void;
      onGuardianEvent: (callback: (message: string) => void) => () => void;
    };
  }
}
