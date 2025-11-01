import { exec } from 'child_process';
import { promisify } from 'util';
import type { SystemStats } from '@/types/System.types';

const execAsync = promisify(exec);

/**
 * Servicio para obtener estadísticas del sistema
 */
export class SystemStatsService {
  private isDevelopmentMode = process.env.NODE_ENV !== 'production';

  /**
   * Obtiene las estadísticas completas del sistema
   * @returns Estadísticas de CPU, GPU, temperaturas y ventiladores
   */
  async getSystemStats(): Promise<SystemStats> {
    if (this.isDevelopmentMode) {
      return this.getMockStats();
    }

    try {
      const [cpuData, gpuData] = await Promise.all([
        this.getCpuStats(),
        this.getGpuStats()
      ]);

      return {
        ...cpuData,
        ...gpuData
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al obtener estadísticas del sistema', { error: errorMessage });
      throw new Error(`ShellError: Error al leer estadísticas del sistema. ${errorMessage}`);
    }
  }

  /**
   * Obtiene estadísticas de CPU usando lm-sensors
   */
  private async getCpuStats(): Promise<Partial<SystemStats>> {
    try {
      const { stdout } = await execAsync('sensors -u');
      
      // Parsear la salida de sensors
      // Esto es un ejemplo simplificado, necesitarás ajustarlo según tu hardware
      const cpuTempMatch = stdout.match(/temp1_input:\s+([\d.]+)/);
      const fan1Match = stdout.match(/fan1_input:\s+([\d.]+)/);
      const fan2Match = stdout.match(/fan2_input:\s+([\d.]+)/);

      return {
        cpuTemp: cpuTempMatch ? parseFloat(cpuTempMatch[1]) : 0,
        systemTemp: cpuTempMatch ? parseFloat(cpuTempMatch[1]) : 0,
        fan1Rpm: fan1Match ? parseFloat(fan1Match[1]) : 0,
        fan2Rpm: fan2Match ? parseFloat(fan2Match[1]) : 0,
        cpuUsage: await this.getCpuUsage()
      };
    } catch (error) {
      console.warn('Error al obtener stats de CPU, usando valores por defecto');
      return {
        cpuTemp: 0,
        systemTemp: 0,
        fan1Rpm: 0,
        fan2Rpm: 0,
        cpuUsage: 0
      };
    }
  }

  /**
   * Obtiene estadísticas de GPU usando nvidia-smi
   */
  private async getGpuStats(): Promise<Partial<SystemStats>> {
    try {
      const { stdout } = await execAsync(
        'nvidia-smi --query-gpu=temperature.gpu,utilization.gpu --format=csv,noheader,nounits'
      );
      
      const [temp, usage] = stdout.trim().split(',').map(s => parseFloat(s.trim()));

      return {
        gpuTemp: temp || 0,
        gpuUsage: usage || 0
      };
    } catch (error) {
      console.warn('Error al obtener stats de GPU (nvidia-smi), usando valores por defecto');
      return {
        gpuTemp: 0,
        gpuUsage: 0
      };
    }
  }

  /**
   * Obtiene el uso de CPU
   */
  private async getCpuUsage(): Promise<number> {
    try {
      const { stdout } = await execAsync(
        "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'"
      );
      return parseFloat(stdout.trim()) || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Genera estadísticas simuladas para modo desarrollo
   */
  private getMockStats(): SystemStats {
    return {
      cpuTemp: 45 + Math.random() * 20, // Entre 45-65°C
      gpuTemp: 40 + Math.random() * 25, // Entre 40-65°C
      systemTemp: 42 + Math.random() * 18, // Entre 42-60°C
      fan1Rpm: 2000 + Math.random() * 2000, // Entre 2000-4000 RPM
      fan2Rpm: 2200 + Math.random() * 1800, // Entre 2200-4000 RPM
      cpuUsage: Math.random() * 100, // 0-100%
      gpuUsage: Math.random() * 100 // 0-100%
    };
  }
}
