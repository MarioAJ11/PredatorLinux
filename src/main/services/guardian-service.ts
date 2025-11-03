import type { BrowserWindow } from 'electron';
import { FanControlService } from './fan-control-service';
import type { SystemStats } from '../../types';

// Umbrales de temperatura crítica (°C)
const CRITICAL_TEMP = {
  cpu: 95,
  gpu: 90,
  system: 85,
};

export class GuardianService {
  private intervalId: NodeJS.Timeout | null = null;
  private isEmergencyMode = false;
  private lastStats: SystemStats | null = null;

  constructor(
    private window: BrowserWindow,
    private fanControl: FanControlService
  ) {}

  /**
   * Inicia el guardián de seguridad (monitoreo cada 2 segundos)
   */
  start() {
    this.stop();

    console.log('[GuardianService] 🛡️ Guardián de Seguridad activado');

    this.intervalId = setInterval(() => {
      if (this.lastStats) {
        this.checkTemperatures(this.lastStats);
      }
    }, 2000);
  }

  /**
   * Actualiza las estadísticas para el monitoreo
   */
  updateStats(stats: SystemStats) {
    this.lastStats = stats;
  }

  /**
   * Verifica las temperaturas y toma acciones si son críticas
   */
  private checkTemperatures(stats: SystemStats) {
    const isCritical = 
      stats.cpuTemp > CRITICAL_TEMP.cpu ||
      stats.gpuTemp > CRITICAL_TEMP.gpu ||
      stats.systemTemp > CRITICAL_TEMP.system;

    if (isCritical && !this.isEmergencyMode) {
      this.activateEmergencyMode(stats);
    } else if (!isCritical && this.isEmergencyMode) {
      this.deactivateEmergencyMode();
    }
  }

  /**
   * Activa el modo emergencia: Ventiladores al 100%
   */
  private async activateEmergencyMode(stats: SystemStats) {
    console.error('[GuardianService] ⚠️ TEMPERATURA CRÍTICA DETECTADA');
    console.error(`[GuardianService] CPU: ${stats.cpuTemp}°C | GPU: ${stats.gpuTemp}°C | Sistema: ${stats.systemTemp}°C`);

    this.isEmergencyMode = true;

    try {
      // Forzar ventiladores al máximo
      await this.fanControl.forceMaxSpeed();

      const message = `⚠️ TEMPERATURA CRÍTICA: Ventiladores forzados al 100%\nCPU: ${stats.cpuTemp}°C | GPU: ${stats.gpuTemp}°C`;
      
      // Notificar al frontend
      if (!this.window.isDestroyed()) {
        this.window.webContents.send('guardian:event', message);
      }

      console.error('[GuardianService] 🛡️ Modo emergencia activado');
    } catch (error) {
      console.error('[GuardianService] ERROR CRÍTICO: No se pudieron activar ventiladores de emergencia:', error);
    }
  }

  /**
   * Desactiva el modo emergencia
   */
  private deactivateEmergencyMode() {
    console.log('[GuardianService] ✓ Temperaturas normalizadas, desactivando modo emergencia');

    this.isEmergencyMode = false;

    const message = '✓ Temperaturas normales. Modo emergencia desactivado.';
    
    if (!this.window.isDestroyed()) {
      this.window.webContents.send('guardian:event', message);
    }
  }

  /**
   * Detiene el guardián
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Verifica si está en modo emergencia
   */
  isInEmergencyMode(): boolean {
    return this.isEmergencyMode;
  }
}
