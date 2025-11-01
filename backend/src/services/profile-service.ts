import { exec } from 'child_process';
import { promisify } from 'util';
import { TURBO_MODE_PATH } from '@/utils/constants';

const execAsync = promisify(exec);

/**
 * Servicio para gestionar los perfiles de rendimiento del sistema
 */
export class ProfileService {
  private isDevelopmentMode = process.env.NODE_ENV !== 'production';
  
  /**
   * Activa o desactiva el modo Turbo
   * @param enable - true para activar, false para desactivar
   * @throws Error con prefijo ShellError si el comando falla
   */
  async setTurboMode(enable: boolean): Promise<void> {
    // Modo de desarrollo: simular el comando sin ejecutarlo realmente
    if (this.isDevelopmentMode) {
      console.info(`[DEV MODE] Simulando: Modo Turbo ${enable ? 'activado' : 'desactivado'}.`);
      // Simular un pequeño delay como si ejecutáramos el comando
      await new Promise(resolve => setTimeout(resolve, 100));
      return;
    }

    const value = enable ? '1' : '0';
    // ¡IMPORTANTE! Este comando requiere permisos 'sudo'.
    // El servidor Node.js debe tener permisos NOPASSWD en 'sudoers' para 'tee'.
    const command = `echo ${value} | sudo tee ${TURBO_MODE_PATH}`;
    
    try {
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr && !stderr.includes(TURBO_MODE_PATH)) {
        throw new Error(stderr);
      }
      
      console.info(`Modo Turbo ${enable ? 'activado' : 'desactivado'}.`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al ejecutar comando de modo turbo', { command, error: errorMessage });
      throw new Error(`ShellError: Error al cambiar el modo de rendimiento. ${errorMessage}`);
    }
  }

  /**
   * Establece un perfil de rendimiento completo
   * @param mode - Modo de rendimiento: 'turbo' | 'quiet' | 'balanced' | 'performance'
   */
  async setPerformanceMode(mode: 'turbo' | 'quiet' | 'balanced' | 'performance'): Promise<void> {
    if (this.isDevelopmentMode) {
      console.info(`[DEV MODE] Simulando: Perfil de rendimiento establecido a '${mode}'`);
      await new Promise(resolve => setTimeout(resolve, 100));
      return;
    }

    // Mapeo de modos a configuraciones del sistema
    const modeConfigs = {
      turbo: { turbo: true, governor: 'performance' },
      performance: { turbo: false, governor: 'performance' },
      balanced: { turbo: false, governor: 'powersave' },
      quiet: { turbo: false, governor: 'powersave' }
    };

    const config = modeConfigs[mode];

    try {
      // Establecer modo turbo
      await this.setTurboMode(config.turbo);

      // Establecer CPU governor
      const cpuCommand = `echo ${config.governor} | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor`;
      await execAsync(cpuCommand);

      console.info(`Perfil de rendimiento establecido a '${mode}'`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al establecer perfil de rendimiento', { mode, error: errorMessage });
      throw new Error(`ShellError: Error al establecer perfil de rendimiento. ${errorMessage}`);
    }
  }
}
