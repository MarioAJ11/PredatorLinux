import { exec } from 'child_process';
import { promisify } from 'util';
import type { BrowserWindow } from 'electron';
import type { SystemStats } from '../../types';

const execAsync = promisify(exec);

export class StatsService {
  private intervalId: NodeJS.Timeout | null = null;
  
  constructor(private window: BrowserWindow) {}

  /**
   * Inicia el monitoreo de estadísticas cada 2 segundos
   */
  startMonitoring() {
    this.stopMonitoring();
    
    this.intervalId = setInterval(async () => {
      try {
        const stats = await this.collectStats();
        
        if (!this.window.isDestroyed()) {
          this.window.webContents.send('stats:update', stats);
        }
      } catch (error) {
        console.error('[StatsService] Error al obtener estadísticas:', error);
      }
    }, 2000);
  }

  /**
   * Recolecta todas las estadísticas del sistema
   */
  private async collectStats(): Promise<SystemStats> {
    const [sensors, nvidia] = await Promise.allSettled([
      this.getSensorData(),
      this.getNvidiaData(),
    ]);

    // Valores por defecto si hay error
    const sensorData = sensors.status === 'fulfilled' ? sensors.value : {
      cpuTemp: 0,
      systemTemp: 0,
      fan1Rpm: 0,
      fan2Rpm: 0,
      cpuUsage: 0,
    };

    const nvidiaData = nvidia.status === 'fulfilled' ? nvidia.value : {
      gpuTemp: 0,
      gpuUsage: 0,
    };

    return {
      ...sensorData,
      ...nvidiaData,
      timestamp: Date.now(),
    };
  }

  /**
   * Obtiene datos de lm-sensors (CPU, ventiladores)
   */
  private async getSensorData() {
    try {
      const { stdout } = await execAsync('sensors -j');
      const data = JSON.parse(stdout);

      let cpuTemp = 0;
      let systemTemp = 0;
      let fan1Rpm = 0;
      let fan2Rpm = 0;

      // Parsear coretemp para temperatura de CPU (Acer Predator)
      if (data['coretemp-isa-0000']) {
        const coretemp = data['coretemp-isa-0000'];
        if (coretemp['Package id 0']) {
          cpuTemp = coretemp['Package id 0'].temp1_input || 0;
        }
      }

      // Parsear acpitz para temperatura del sistema
      if (data['acpitz-acpi-0']) {
        const acpitz = data['acpitz-acpi-0'];
        if (acpitz.temp1) {
          systemTemp = acpitz.temp1.temp1_input || 0;
        }
      }

      // Intentar leer velocidad de ventiladores desde hwmon
      try {
        const fan1Data = await execAsync('cat /sys/class/hwmon/hwmon*/fan1_input 2>/dev/null || echo 0');
        fan1Rpm = parseInt(fan1Data.stdout.trim()) || 0;
      } catch {
        fan1Rpm = 0;
      }

      try {
        const fan2Data = await execAsync('cat /sys/class/hwmon/hwmon*/fan2_input 2>/dev/null || echo 0');
        fan2Rpm = parseInt(fan2Data.stdout.trim()) || 0;
      } catch {
        fan2Rpm = 0;
      }

      // Obtener uso de CPU
      const cpuUsage = await this.getCpuUsage();

      return {
        cpuTemp,
        systemTemp,
        fan1Rpm,
        fan2Rpm,
        cpuUsage,
      };
    } catch (error) {
      console.error('[StatsService] Error leyendo sensors:', error);
      throw error;
    }
  }

  /**
   * Obtiene datos de NVIDIA GPU
   */
  private async getNvidiaData() {
    try {
      const { stdout } = await execAsync(
        'nvidia-smi --query-gpu=temperature.gpu,utilization.gpu --format=csv,noheader,nounits'
      );

      const [gpuTemp, gpuUsage] = stdout.trim().split(',').map(Number);

      return {
        gpuTemp: gpuTemp || 0,
        gpuUsage: gpuUsage || 0,
      };
    } catch (error) {
      // Es normal si no hay GPU NVIDIA
      return {
        gpuTemp: 0,
        gpuUsage: 0,
      };
    }
  }

  /**
   * Calcula el uso promedio de CPU
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

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
