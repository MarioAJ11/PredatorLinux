import * as sudo from 'sudo-prompt';
import type { FanType, FanMode } from '../../types';

const sudoOptions = {
  name: 'PredatorLinux Control',
};

// Rutas del sistema para control de ventiladores
// NOTA: Estas rutas pueden variar según el modelo de laptop
// Puede ser necesario usar 'find /sys -name "pwm*"' para encontrarlas
const FAN_PATHS = {
  cpu: {
    mode: '/sys/devices/platform/acer-wmi/hwmon/hwmon4/pwm1_enable',
    speed: '/sys/devices/platform/acer-wmi/hwmon/hwmon4/pwm1',
  },
  gpu: {
    mode: '/sys/devices/platform/acer-wmi/hwmon/hwmon4/pwm2_enable',
    speed: '/sys/devices/platform/acer-wmi/hwmon/hwmon4/pwm2',
  },
};

export class FanControlService {
  /**
   * Establece el modo de control del ventilador
   * @param fan - 'cpu' o 'gpu'
   * @param mode - 1 = manual, 2 = auto
   */
  async setFanMode(fan: FanType, mode: 1 | 2): Promise<void> {
    const path = FAN_PATHS[fan].mode;
    const command = `sh -c 'echo ${mode} | tee ${path}'`;
    
    return this.execSudo(command, `establecer modo de ventilador ${fan}`);
  }

  /**
   * Establece la velocidad manual del ventilador (0-255)
   * @param fan - 'cpu' o 'gpu'
   * @param speed - Porcentaje 0-100 (se convierte a 0-255)
   */
  async setFanSpeed(fan: FanType, speed: number): Promise<void> {
    // Primero establecer modo manual
    await this.setFanMode(fan, 1);

    // Convertir porcentaje a valor 0-255
    const pwmValue = Math.round((speed / 100) * 255);
    const path = FAN_PATHS[fan].speed;
    const command = `sh -c 'echo ${pwmValue} | tee ${path}'`;
    
    return this.execSudo(command, `establecer velocidad de ventilador ${fan} a ${speed}%`);
  }

  /**
   * Activa el modo automático de ventiladores
   */
  async setAutoMode(): Promise<void> {
    await Promise.all([
      this.setFanMode('cpu', 2),
      this.setFanMode('gpu', 2),
    ]);
  }

  /**
   * Fuerza los ventiladores al máximo (modo emergencia)
   */
  async forceMaxSpeed(): Promise<void> {
    console.warn('[FanControlService] ⚠️ MODO EMERGENCIA: Ventiladores al 100%');
    
    await Promise.all([
      this.setFanSpeed('cpu', 100),
      this.setFanSpeed('gpu', 100),
    ]);
  }

  /**
   * Ejecuta un comando con sudo usando sudo-prompt
   */
  private execSudo(command: string, description: string): Promise<void> {
    return new Promise((resolve, reject) => {
      sudo.exec(command, sudoOptions, (error, stdout, stderr) => {
        if (error) {
          console.error(`[FanControlService] Error al ${description}:`, { error, stderr });
          
          if (error.message && error.message.includes('User did not grant permission')) {
            reject(new Error('Permiso denegado por el usuario'));
          } else {
            reject(new Error(`Error al ${description}: ${error.message}`));
          }
        } else {
          console.log(`[FanControlService] ✓ ${description}`);
          resolve();
        }
      });
    });
  }

  /**
   * Verifica si las rutas de ventilador existen
   */
  async verifyPaths(): Promise<boolean> {
    // TODO: Implementar verificación de rutas
    return true;
  }
}
