import { exec } from 'child_process';
import { promisify } from 'util';
import { MAX_FAN_SPEED_PERCENT, MIN_FAN_SPEED_PERCENT } from '@/utils/constants';

const execAsync = promisify(exec);

/**
 * Servicio para controlar los ventiladores del sistema
 */
export class FanService {
  private isDevelopmentMode = process.env.NODE_ENV !== 'production';

  /**
   * Establece la velocidad de un ventilador específico
   * @param fan - Identificador del ventilador ('cpu' o 'gpu')
   * @param speed - Velocidad en porcentaje (0-100)
   */
  async setFanSpeed(fan: 'cpu' | 'gpu', speed: number): Promise<void> {
    // Validar rango
    if (speed < MIN_FAN_SPEED_PERCENT || speed > MAX_FAN_SPEED_PERCENT) {
      throw new Error(`La velocidad debe estar entre ${MIN_FAN_SPEED_PERCENT} y ${MAX_FAN_SPEED_PERCENT}`);
    }

    if (this.isDevelopmentMode) {
      console.info(`[DEV MODE] Simulando: Ventilador ${fan} establecido a ${speed}%`);
      await new Promise(resolve => setTimeout(resolve, 100));
      return;
    }

    // En un sistema real, aquí ejecutarías comandos específicos del hardware
    // Por ejemplo, para portátiles Predator con acer_wmi:
    const fanPath = fan === 'cpu' 
      ? '/sys/module/acer_wmi/drivers/platform:acer-wmi/acer-wmi/predator_sense/fan1_speed'
      : '/sys/module/acer_wmi/drivers/platform:acer-wmi/acer-wmi/predator_sense/fan2_speed';

    const command = `echo ${speed} | sudo tee ${fanPath}`;

    try {
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr && !stderr.includes(fanPath)) {
        throw new Error(stderr);
      }
      
      console.info(`Ventilador ${fan} establecido a ${speed}%`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al controlar ventilador', { fan, speed, error: errorMessage });
      throw new Error(`ShellError: Error al controlar el ventilador. ${errorMessage}`);
    }
  }

  /**
   * Establece el modo automático de ventiladores
   */
  async setAutoMode(): Promise<void> {
    if (this.isDevelopmentMode) {
      console.info('[DEV MODE] Simulando: Modo automático de ventiladores activado');
      await new Promise(resolve => setTimeout(resolve, 100));
      return;
    }

    // Comando para restablecer control automático
    const command = 'echo 255 | sudo tee /sys/module/acer_wmi/drivers/platform:acer-wmi/acer-wmi/predator_sense/fan_mode';

    try {
      await execAsync(command);
      console.info('Modo automático de ventiladores activado');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al activar modo automático', { error: errorMessage });
      throw new Error(`ShellError: Error al activar modo automático. ${errorMessage}`);
    }
  }
}
