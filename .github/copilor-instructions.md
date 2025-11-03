# Instrucciones para GitHub Copilot

## 🎯 Proyecto: PredatorLinux (Pop\!\_OS Desktop App)

**Objetivo:** Crear una aplicación de escritorio nativa para Pop\!\_OS (Linux) que replique la funcionalidad de **PredatorSense**. La aplicación controlará el hardware de portátiles Predator (ej. PH-317-55) de forma segura.

**Funcionalidad Clave:**

1.  **Gestión de Perfiles:**
      * Crear y seleccionar perfiles (ej. "Silencioso", "Equilibrado", "Rendimiento").
      * Un perfil es un conjunto de ajustes (Modo Turbo, curva de ventilador, ajuste de CPU, RGB).
2.  **Monitor de Sistema:**
      * Dashboard en tiempo real con temperaturas (CPU, GPU), carga (CPU, GPU) y velocidad de ventiladores (RPM).
3.  **Control de Hardware:**
      * Activar/Desactivar Modo Turbo (botón Predator).
      * Controlar ventiladores (modos automático, manual y curvas personalizadas).
4.  **Control RGB del Teclado:**
      * Controlar efectos (Estático, Ola, Respiración) y colores.
5.  **Guardián de Seguridad:**
      * Un servicio de fondo que monitorea las temperaturas y toma el control de los ventiladores (forzándolos al 100%) si se detectan temperaturas críticas (\>95°C), para **evitar daños al hardware**.

-----

## 🥞 Stack Tecnológico

  - **Framework de Escritorio:** Electron
  - **UI (Renderer):** React
  - **Lenguaje (Ambos procesos):** TypeScript
  - **UI Components:** Tailwind CSS
  - **State Management:** **Redux Toolkit** (Esencial para gestionar el estado de los perfiles y las estadísticas).
  - **Core Logic (Main):**
      - `sudo-prompt` (Para comandos de `sudo` de forma segura).
      - `child_process` (Para comandos sin `sudo` como `lm-sensors`, `nvidia-smi`).
  - **Build Tool:** Vite (para el Renderer) + Electron Builder (para empaquetar la app).

-----

## 🔐 Seguridad y Permisos: `sudo-prompt`

**Esta es la regla más importante.** Para que la aplicación sea segura y la pueda usar "cualquier persona", **NO se debe modificar `sudoers`**.

Usaremos `sudo-prompt` para todos los comandos que requieran elevación. Esto mostrará un diálogo de contraseña nativo de Pop\!\_OS al usuario.

**Comandos que requieren `sudo-prompt`:**

  * Escribir en `/sys/.../turbo_mode` (usando `tee`).
  * Escribir en archivos del kernel para control de ventiladores (usando `tee`).
  * Posiblemente, ejecutar comandos de control RGB (depende de la herramienta).

**Comandos que NO requieren `sudo`:**

  * Leer `lm-sensors` (si el usuario está en el grupo `sensors`).
  * Leer `nvidia-smi`.

-----

## 📐 Arquitectura de Electron (Main / Preload / Renderer)

### 1\. Proceso "Main" (Backend de Node.js)

Aquí vive toda la lógica.

  * `main.ts`: Inicia la app, crea la ventana y registra los *handlers* de IPC.
  * `services/guardian-service.ts`: El "Guardián de Seguridad". Se ejecuta en un `setInterval` (ej. cada 2 segundos) para leer temperaturas. Si son muy altas, toma el control de los ventiladores, ignorando el perfil del usuario.
  * `services/stats-service.ts`: Obtiene datos de `lm-sensors -j` (JSON) y `nvidia-smi`. Envía estos datos al Renderer cada segundo.
  * `services/profile-service.ts`: Lógica para *aplicar* un perfil. Llama a otros servicios. (Ej. `applyPerformanceProfile()`).
  * `services/fan-control-service.ts`: Lógica para escribir en los archivos del kernel (`/sys/...`) usando `sudo-prompt` y `tee`.
  * `services/rgb-service.ts`: Lógica para controlar el RGB.

> **¡Importante para Copilot\!** El control RGB en portátiles Predator en Linux es complejo. El comando real es desconocido. Por ahora, asume que existe una herramienta CLI (como `openrgb-cli` o un script de shell) que podemos ejecutar.
> `async setRgb(config: RgbConfig) { ... execAsync('predator-rgb-cli --mode wave --color ff0000') ... }`

### 2\. Script "Preload" (El Puente Seguro)

  * `preload.ts`: Expone la API del backend al frontend (React) de forma segura.

<!-- end list -->

```typescript
// Ubicación: src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';
import type { SystemStats, RgbConfig, PerformanceProfile } from '../types';

// Expone funciones seguras al mundo del Renderer (React)
contextBridge.exposeInMainWorld('electronAPI', {
  // --- Funciones que React puede 'invocar' (llamar) ---
  
  /** Aplica un perfil de rendimiento completo */
  applyProfile: (profile: PerformanceProfile): Promise<void> =>
    ipcRenderer.invoke('profile:apply', profile),
    
  /** Establece una configuración RGB específica */
  setRgb: (config: RgbConfig): Promise<void> =>
    ipcRenderer.invoke('rgb:set', config),

  /** Establece una velocidad de ventilador manual (anula el perfil) */
  setManualFanSpeed: (fan: 'cpu' | 'gpu', speed: number): Promise<void> =>
    ipcRenderer.invoke('fans:set-manual', fan, speed),

  // --- Eventos que React puede 'escuchar' ---
  
  /** * Escucha las actualizaciones de estadísticas (temp, rpm) 
   * que envía el proceso Main cada segundo.
   */
  onStatsUpdate: (callback: (stats: SystemStats) => void) =>
    ipcRenderer.on('stats:update', (event, stats) => callback(stats)),

  /** * Escucha los eventos del Guardián de Seguridad 
   * (ej. sobrecalentamiento detectado).
   */
  onGuardianEvent: (callback: (message: string) => void) =>
    ipcRenderer.on('guardian:event', (event, message) => callback(message)),
});
```

### 3\. Proceso "Renderer" (Frontend de React)

Aquí vive la Interfaz de Usuario.

  * `App.tsx`: Contiene el layout principal (Sidebar, Contenido).
  * `store/store.ts`: Configuración de Redux Toolkit.
  * `store/statsSlice.ts`: Slice de Redux para almacenar la última `SystemStats` recibida.
  * `store/profileSlice.ts`: Slice de Redux para almacenar los perfiles disponibles y el `activeProfile`.
  * `components/Dashboard.tsx`: Muestra las estadísticas (leyendo del `statsSlice`).
  * `components/ProfileSwitcher.tsx`: Muestra los botones de perfil ("Silencioso", "Rendimiento"). Al hacer clic, llama a `window.electronAPI.applyProfile(profile)`.
  * `components/RgbEditor.tsx`: Muestra selectores de color y efectos. Llama a `window.electronAPI.setRgb(config)`.
  * `hooks/useSystemStats.ts`: (¡Importante\!) Un hook personalizado que configura el *listener* `window.electronAPI.onStatsUpdate` en un `useEffect` y actualiza el *store* de Redux.

-----

## 🗂️ Convenciones de Código y Estado

### Lógica del Proceso Main (Servicio con `sudo-prompt`)

Este es el reemplazo para `child_process` + `sudo` inseguro.

```typescript
// Ubicación: src/main/services/fan-control-service.ts
import * as sudo from 'sudo-prompt';
const logger = console; // Asumir un logger

// Opciones para el diálogo de contraseña
const sudoOptions = {
  name: 'PredatorLinux Control',
};

// Ruta de ejemplo (¡la real puede variar!)
const FAN_CPU_MODE_PATH = "/sys/devices/platform/predator_wmi/hwmon/hwmonX/pwm1_enable";
const FAN_CPU_SPEED_PATH = "/sys/devices/platform/predator_wmi/hwmon/hwmonX/pwm1";

/**
 * Servicio para gestionar los ventiladores
 */
export class FanControlService {
  
  /**
   * Establece el modo de control del ventilador (1 = manual, 2 = auto)
   */
  async setFanMode(fan: 'cpu' | 'gpu', mode: 1 | 2): Promise<void> {
    // TODO: Usar la ruta correcta para 'fan' (cpu/gpu)
    const command = `sh -c 'echo ${mode} | tee ${FAN_CPU_MODE_PATH}'`;
    
    return new Promise((resolve, reject) => {
      sudo.exec(command, sudoOptions, (error, stdout, stderr) => {
        if (error) {
          logger.error('Error de sudo-prompt (setFanMode)', { error, stderr });
          if (error.message.includes('User did not grant permission')) {
            reject(new Error('Permiso denegado por el usuario.'));
          } else {
            reject(new Error(`ShellError: ${error.message}`));
          }
        } else {
          resolve();
        }
      });
    });
  }
  
  // ... funciones similares para setFanSpeed ...
}
```

### Lógica del Proceso Main (Servicio de Monitoreo)

Este servicio *empuja* datos a React.

```typescript
// Ubicación: src/main/services/stats-service.ts
import { exec } from 'child_process';
import { BrowserWindow } from 'electron';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class StatsService {
  private intervalId: NodeJS.Timeout | null = null;
  
  constructor(private window: BrowserWindow) {}

  /**
   * Inicia el sondeo de estadísticas cada 2 segundos
   */
  startMonitoring() {
    this.stopMonitoring(); // Detener cualquier sondeo anterior
    
    this.intervalId = setInterval(async () => {
      try {
        // Ejecutar comandos en paralelo
        const [sensors, nvidia] = await Promise.all([
          execAsync('lm-sensors -j'),
          execAsync('nvidia-smi --query-gpu=temperature.gpu,utilization.gpu --format=csv,noheader')
        ]);
        
        // TODO: Parsear la salida de 'sensors.stdout' y 'nvidia.stdout'
        const stats: SystemStats = {
          cpuTemp: 55, // Extraer de sensors.stdout
          gpuTemp: 52, // Extraer de nvidia.stdout
          // ... etc
        };

        // ¡IMPORTANTE! Envía los datos al Renderer
        if (!this.window.isDestroyed()) {
          this.window.webContents.send('stats:update', stats);
        }
        
      } catch (error) {
        logger.error('Error al obtener estadísticas', error);
      }
    }, 2000); // Cada 2 segundos
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
```

### Hook de React (Renderer) para recibir datos

```typescript
// Ubicación: src/renderer/hooks/useSystemStats.ts
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setStats } from '@/store/statsSlice';
import { setGuardianWarning } from '@/store/uiSlice'; // Asumir que existe

// ¡IMPORTANTE! Declarar la API expuesta por el preload script
declare global {
  interface Window {
    electronAPI: {
      onStatsUpdate: (callback: (stats: SystemStats) => void) => void;
      onGuardianEvent: (callback: (message: string) => void) => void;
      // ... otras funciones
    };
  }
}

/**
 * Hook que activa los listeners de Electron
 * y actualiza el store de Redux
 */
export const useElectronListeners = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Activar el listener de estadísticas
    window.electronAPI.onStatsUpdate((stats) => {
      dispatch(setStats(stats));
    });
    
    // Activar el listener del Guardián
    window.electronAPI.onGuardianEvent((message) => {
      dispatch(setGuardianWarning(message)); // Mostrar advertencia en la UI
      // Asumimos que 'toast' es un sistema de notificaciones
      toast.error(message, { duration: 5000 });
    });
    
    // TODO: Devolver una función de limpieza para
    // desregistrar los listeners si el componente se desmonta
    
  }, [dispatch]);
};
```

### Estructura de Tipos y Perfiles

```typescript
// Ubicación: src/types/index.ts

/** Estadísticas en tiempo real del sistema */
export interface SystemStats {
  cpuTemp: number;
  gpuTemp: number;
  systemTemp: number;
  fan1Rpm: number;
  fan2Rpm: number;
  cpuUsage: number;
  gpuUsage: number;
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