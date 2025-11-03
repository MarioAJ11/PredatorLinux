import { FanControlService } from './fan-control-service';
import { RgbService } from './rgb-service';
import type { PerformanceProfile } from '../../types';
import * as sudo from 'sudo-prompt';

const sudoOptions = {
  name: 'PredatorLinux Control',
};

const TURBO_MODE_PATH = '/sys/devices/system/cpu/intel_pstate/no_turbo';

export class ProfileService {
  constructor(
    private fanControl: FanControlService,
    private rgbService: RgbService
  ) {}

  /**
   * Aplica un perfil completo de rendimiento
   */
  async applyProfile(profile: PerformanceProfile): Promise<void> {
    console.log(`[ProfileService] Aplicando perfil: ${profile.name}`);

    try {
      // 1. Modo Turbo
      await this.setTurboMode(profile.turboMode);

      // 2. CPU Governor
      await this.setCpuGovernor(profile.cpuGovernor);

      // 3. Control de ventiladores
      if (profile.fanMode === 'auto') {
        await this.fanControl.setAutoMode();
      } else if (profile.fanMode === 'manual' && profile.fanSpeed !== undefined) {
        await this.fanControl.setFanSpeed('cpu', profile.fanSpeed);
        await this.fanControl.setFanSpeed('gpu', profile.fanSpeed);
      }

      // 4. RGB
      await this.rgbService.setRgb(profile.rgbConfig);

      console.log(`[ProfileService] ✓ Perfil "${profile.name}" aplicado correctamente`);
    } catch (error) {
      console.error(`[ProfileService] Error aplicando perfil:`, error);
      throw error;
    }
  }

  /**
   * Activa o desactiva el modo Turbo de Intel
   */
  async setTurboMode(enable: boolean): Promise<void> {
    // En /sys/devices/system/cpu/intel_pstate/no_turbo:
    // 0 = turbo habilitado
    // 1 = turbo deshabilitado
    const value = enable ? '0' : '1';
    const command = `sh -c 'echo ${value} | tee ${TURBO_MODE_PATH}'`;

    return new Promise((resolve, reject) => {
      sudo.exec(command, sudoOptions, (error: any) => {
        if (error) {
          console.error('[ProfileService] Error al cambiar modo turbo:', error);
          reject(new Error(`Error al cambiar modo turbo: ${error.message}`));
        } else {
          console.log(`[ProfileService] ✓ Modo Turbo ${enable ? 'activado' : 'desactivado'}`);
          resolve();
        }
      });
    });
  }

  /**
   * Cambia el CPU governor (powersave, performance, etc.)
   */
  private async setCpuGovernor(governor: string): Promise<void> {
    const command = `sh -c 'echo ${governor} | tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor'`;

    return new Promise((resolve, reject) => {
      sudo.exec(command, sudoOptions, (error: any) => {
        if (error) {
          console.error('[ProfileService] Error al cambiar CPU governor:', error);
          // No rechazar, solo advertir (puede que no esté disponible)
          console.warn('[ProfileService] ⚠️ No se pudo cambiar CPU governor');
          resolve();
        } else {
          console.log(`[ProfileService] ✓ CPU Governor establecido a: ${governor}`);
          resolve();
        }
      });
    });
  }

  /**
   * Obtiene perfiles predefinidos
   */
  getDefaultProfiles(): PerformanceProfile[] {
    return [
      {
        id: 'quiet',
        name: 'Silencioso',
        turboMode: false,
        fanMode: 'auto',
        cpuGovernor: 'powersave',
        rgbConfig: {
          mode: 'static',
          speed: 1,
          color: '#0066FF',
        },
      },
      {
        id: 'balanced',
        name: 'Equilibrado',
        turboMode: false,
        fanMode: 'auto',
        cpuGovernor: 'balanced',
        rgbConfig: {
          mode: 'breathing',
          speed: 3,
          color: '#00FFFF',
        },
      },
      {
        id: 'performance',
        name: 'Rendimiento',
        turboMode: true,
        fanMode: 'manual',
        fanSpeed: 75,
        cpuGovernor: 'performance',
        rgbConfig: {
          mode: 'wave',
          speed: 5,
          color: '#FF0000',
        },
      },
    ];
  }
}
