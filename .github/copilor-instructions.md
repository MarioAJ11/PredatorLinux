# Instrucciones para GitHub Copilot

## 🎯 Proyecto: PredatorLinux (Versión de Escritorio)

**Objetivo:** Crear una aplicación de escritorio nativa para Pop\!\_OS (Linux) que se ejecuta localmente para controlar el hardware de un portátil Predator (ej. PH-317-55).

**Funcionalidad Clave:**

  - **Proceso Principal (Electron/Node.js):** Un proceso de fondo que ejecuta comandos de terminal (`sudo tee`, `nvidia-smi`, `lm-sensors`) para controlar ventiladores, perfiles de rendimiento (Turbo), luces RGB y leer estadísticas del sistema.
  - **Interfaz de Usuario (React):** Una ventana de escritorio nativa (proceso "Renderer") que muestra la interfaz gráfica para visualizar datos y enviar comandos de control al proceso principal.
  - **Comunicación:** Comunicación entre procesos (IPC) de Electron para que React pueda llamar a las funciones de Node.js de forma segura.
  - **NO hay autenticación de usuario** ni base de datos. Los perfiles se aplican directamente al sistema.

-----

## 🥞 Stack Tecnológico

  - **Framework de Escritorio:** Electron
  - **UI (Renderer):** React
  - **Lenguaje (Ambos procesos):** TypeScript
  - **UI Components:** Tailwind CSS
  - **State Management:** Redux Toolkit
  - **Core Logic (Main):** `child_process` (para ejecutar comandos de shell)
  - **Build Tool:** Vite (para el Renderer) + Electron Builder (para empaquetar la app)

-----

## 🔐 Seguridad Crítica: Configuración de `sudo`

Esta aplicación **requiere** ejecutar comandos como `sudo`. El proceso principal de Electron se ejecuta con los permisos del usuario actual. Para que `sudo tee ...` funcione sin bloquear la app pidiendo una contraseña, el usuario que ejecuta la aplicación debe tener permisos `NOPASSWD` para los comandos específicos.

**Acción Requerida (Manual):**
Editar el archivo de `sudoers` usando `sudo visudo` y añadir una línea para tu usuario:

```bash
# ADVERTENCIA: Esto permite a 'tu_usuario' ejecutar 'tee' con sudo SIN contraseña.
# Asegúrate de que la ruta al ejecutable 'tee' es correcta.
tu_usuario ALL=(ALL) NOPASSWD: /usr/bin/tee
```

*Nota: Una alternativa es usar el paquete `sudo-prompt`, que mostrará un diálogo de contraseña gráfico nativo al usuario cada vez que se requiera elevación.*

-----

## 📐 Arquitectura de Electron: Main vs. Renderer

Este proyecto tiene dos partes principales que se comunican:

1.  **Proceso "Main" (`main.ts`):**

      * Es el backend de Node.js.
      * Crea la ventana de la aplicación.
      * Tiene acceso completo a las APIs de Node.js (`child_process`, `fs`).
      * Aquí es donde vivirá el `ProfileService`.
      * Escucha eventos de la UI usando `ipcMain.handle`.

2.  **Proceso "Renderer" (`renderer.tsx`):**

      * Es la interfaz de usuario de React.
      * Se ejecuta en una sandbox (como una página web).
      * **No** tiene acceso directo a Node.js por seguridad.

3.  **"Preload" Script (`preload.ts`):**

      * El "puente" seguro entre Main y Renderer.
      * Usa `contextBridge.exposeInMainWorld` para exponer funciones seguras (ej. `window.electronAPI.setTurboMode()`) que el código de React puede llamar.

-----

## 🗂️ Convenciones de Código

### Nomenclatura

#### TypeScript/JavaScript

```typescript
// ✅ Variables y funciones: camelCase
const fanSpeed = 100;
const getSystemStats = () => {};

// ✅ Clases y componentes: PascalCase
class ProfileService {}
const FanSlider = () => {};

// ✅ Constantes: UPPER_SNAKE_CASE
const MAX_FAN_RPM = 6000;
const TURBO_MODE_PATH = "/sys/module/acer_wmi/drivers/platform:acer-wmi/acer-wmi/predator_sense/turbo_mode";

// ✅ Interfaces y Types: PascalCase
interface SystemStats {
  cpuTemp: number;
  gpuTemp: number;
  fan1Rpm: number;
}
type PerformanceMode = "turbo" | "quiet" | "balanced" | "performance";

// ✅ Enums: PascalCase
enum RgbEffect {
  Static = "STATIC",
  Wave = "WAVE"
}

// ✅ Archivos de componentes: PascalCase.tsx
// FanSlider.tsx, StatsDashboard.tsx

// ✅ Archivos de servicios/utils (Main): kebab-case.ts
// profile-service.ts, system-stats.ts
```

-----

### Estructura de Código

#### Imports

```typescript
// 1. Imports de librerías externas
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Asumiendo Redux

// 2. Imports internos (absolute paths)
import { useAppDispatch } from '@/store/hooks';
import { Button } from '@/components/ui/Button';

// 3. Imports relativos
import { formatTemperature } from '../utils/formatters';

// 4. Imports de tipos
import type { SystemStats } from '@/types/System.types';

// 5. Imports de estilos
import './styles.css';
```

#### Servicios del Proceso Principal (Node.js)

Este código se ejecuta en el proceso **Main**. Es idéntico a tu servicio de backend, pero no es un servidor API.

```typescript
// Ubicación: src/main/services/profile-service.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Asumimos que esta clase Logger existe en otra parte
const logger = console; 

// Ruta al archivo del kernel para el modo turbo
const TURBO_MODE_PATH = "/sys/module/acer_wmi/drivers/platform:acer-wmi/acer-wmi/predator_sense/turbo_mode";

/**
 * Servicio para gestionar los perfiles de rendimiento
 */
export class ProfileService {
  
  /**
   * Activa o desactiva el modo Turbo
   * @param enable - true para activar, false para desactivar
   * @throws ShellError si el comando falla
   */
  async setTurboMode(enable: boolean): Promise<void> {
    const value = enable ? '1' : '0';
    // ¡IMPORTANTE! Este comando requiere la configuración NOPASSWD en 'sudoers'
    const command = `echo ${value} | sudo tee ${TURBO_MODE_PATH}`;
    
    try {
      const { stdout, stderr } = await execAsync(command);
      if (stderr) {
        throw new Error(stderr); // Lanza un error si hay salida de error
      }
      logger.info(`Modo Turbo ${enable ? 'activado' : 'desactivado'}.`);
    } catch (error) {
      logger.error('Error al ejecutar comando de modo turbo', { command, error });
      // Lanza un error personalizado para el proceso Main
      throw new Error(`ShellError: Error al cambiar el modo de rendimiento. ${error.message}`);
    }
  }
}
```

#### Comunicación IPC (El "Puente")

Estos archivos conectan el Frontend (React) con el Backend (Node.js).

```typescript
// Ubicación: src/preload/index.ts
// Este script define la API que React podrá usar
import { contextBridge, ipcRenderer } from 'electron';

// Expone funciones seguras al mundo del Renderer (React)
contextBridge.exposeInMainWorld('electronAPI', {
  // Expone 'setTurboMode'
  setTurboMode: (enable: boolean): Promise<void> => {
    return ipcRenderer.invoke('profile:set-turbo', enable);
  },
  
  // Aquí se expondrían otras funciones
  // getSystemStats: (): Promise<SystemStats> => {
  //   return ipcRenderer.invoke('stats:get-all');
  // }
});
```

```typescript
// Ubicación: src/main/index.ts (Fragmento)
// Este código "escucha" las llamadas desde React
import { ipcMain } from 'electron';
import { ProfileService } from './services/profile-service';

// Instanciar el servicio
const profileService = new ProfileService();

// Registrar el "handler" para la llamada 'profile:set-turbo'
ipcMain.handle('profile:set-turbo', async (event, enable: boolean) => {
  try {
    await profileService.setTurboMode(enable);
  } catch (error) {
    logger.error('Fallo en IPC handler profile:set-turbo', error);
    // Lanza el error de vuelta al Renderer para que React pueda hacer catch()
    throw error;
  }
});
```

#### Componente React (Proceso Renderer)

Así es como React llama a la función de Node.js.

```typescript
// Ubicación: src/renderer/components/TurboButton.tsx

// ¡IMPORTANTE! Declarar la API expuesta por el preload script
// Esto le da a TypeScript conocimiento de window.electronAPI
declare global {
  interface Window {
    electronAPI: {
      setTurboMode: (enable: boolean) => Promise<void>;
    };
  }
}

/**
 * Botón para activar el modo Turbo
 */
export const TurboButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Asumimos que 'toast' es un sistema de notificaciones
  
  const handleTurboClick = async () => {
    setIsLoading(true);
    try {
      // ✅ ¡Ya no es Axios! Es una llamada directa a la API de Electron
      await window.electronAPI.setTurboMode(true);
      toast.success('¡Modo Turbo activado!');
    } catch (error) {
      // ✅ El error es un Error estándar, no un AxiosError
      toast.error(error.message || 'Error inesperado');
      console.error('Error al activar modo turbo:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button onClick={handleTurboClick} disabled={isLoading}>
      {isLoading ? 'Activando...' : 'Activar Turbo'}
    </Button>
  );
};
```

-----

### Manejo de Errores

#### Frontend (Renderer)

El manejo de errores se hace con `try...catch` estándar al llamar a la API del `preload` (ej. `window.electronAPI.setTurboMode()`), como se ve en el componente anterior.

#### Backend (Main)

El manejo de errores se hace en el *handler* de `ipcMain`. Cualquier error lanzado dentro de `ipcMain.handle` se propaga automáticamente como una Promesa rechazada al `catch` del *Renderer*.

```typescript
// En src/main/index.ts
ipcMain.handle('profile:set-turbo', async (event, enable: boolean) => {
  try {
    // Si setTurboMode() lanza 'ShellError', será capturado
    await profileService.setTurboMode(enable);
  } catch (error) {
    logger.error('Fallo en IPC handler', error);
    // ¡IMPORTANTE! Lanzar el error para que React lo reciba
    throw error; 
  }
});
```

-----

### Async/Await

```typescript
// ✅ Preferir async/await en todos lados (Main y Renderer)
async function setProfile(mode: PerformanceMode) {
  // Asumimos 'window.electronAPI.setProfile' existe
  await window.electronAPI.setProfile(mode);
  toast.success('Perfil actualizado');
}
```

-----

### TypeScript

#### Tipado Estricto

```typescript
// ✅ Tipar todo explícitamente
// (En el Proceso Main)
function setFanSpeed(fan: 'cpu' | 'gpu', speed: number): Promise<void> {
  // ...
}

// ✅ Usar interfaces para objetos
interface SystemStats {
  cpuTemp: number;
  gpuTemp: number;
  systemTemp: number;
  fan1Rpm: number;
  fan2Rpm: number;
  cpuUsage: number;
  gpuUsage: number;
}

// ✅ Union types para valores específicos
type PerformanceMode = 'turbo' | 'quiet' | 'balanced' | 'performance';

// ✅ Utility types
type RgbConfig = Partial<{
  mode: 'static' | 'wave' | 'breathing';
  speed: number;
  color: string; // hex
}>;
```

-----

## 🎨 Preferencias de Estilo

### Comentarios

  - **Idioma:** Español
  - **Formato:** JSDoc para funciones y componentes públicos
  - Comentarios inline para lógica compleja
  - No comentar lo obvio

### Formato

```typescript
// ✅ Destructuring cuando sea legible
const { cpuTemp, gpuTemp } = stats;

// ✅ Template literals
const command = `echo ${value} | sudo tee ${FILE_PATH}`;

// ✅ Optional chaining
const color = config?.color ?? '#FF0000';

// ✅ Arrow functions para callbacks
const highTempSensors = sensors.filter(sensor => sensor.temp > 80);

// ✅ Objetos en múltiples líneas si es largo
const rgbPayload = {
  mode: 'wave',
  speed: 5,
  direction: 'right',
  color: '#00FF00'
};
```

-----

## 🧪 Testing

### Convenciones

Los servicios del proceso **Main** (como `ProfileService`) pueden probarse de forma aislada con Vitest, igual que en el plan original.

```typescript
// ✅ Estructura de tests (ej. con Vitest)
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mockear child_process
const mockExec = vi.fn();
vi.mock('child_process', () => ({
  // Usamos exec en lugar de promisify(exec) para el mock
  exec: (cmd, cb) => mockExec(cmd, cb),
}));

// Importar la clase *después* de mockear
import { ProfileService } from './profile-service';

// Ruta constante para el test
const TURBO_MODE_PATH = "/sys/module/acer_wmi/drivers/platform:acer-wmi/acer-wmi/predator_sense/turbo_mode";


describe('ProfileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('setTurboMode', () => {
    
    it('debería ejecutar el comando correcto para activar turbo', async () => {
      // Arrange
      mockExec.mockImplementation((cmd, cb) => cb(null, { stdout: '', stderr: '' }));
      const profileService = new ProfileService();
      
      // Act
      await profileService.setTurboMode(true);
      
      // Assert
      expect(mockExec).toHaveBeenCalledWith(
        `echo 1 | sudo tee ${TURBO_MODE_PATH}`,
        expect.any(Function)
      );
    });
    
    it('debería lanzar Error si el comando falla', async () => {
      // Arrange
      const errorMsg = 'Permiso denegado';
      mockExec.mockImplementation((cmd, cb) => cb(new Error(errorMsg), { stdout: '', stderr: errorMsg }));
      const profileService = new ProfileService();

      // Act & Assert
      await expect(profileService.setTurboMode(true))
        .rejects.toThrow(`ShellError: Error al cambiar el modo de rendimiento. Error: ${errorMsg}`);
    });
  });
});
```

-----

## ⚡ Performance

### Frontend (Renderer)

```typescript
// ✅ Usar React.memo para componentes de stats que no cambian
export const StatCard = React.memo<StatCardProps>(({ label, value }) => {
  // ...
});

// ✅ useMemo para cálculos derivados (ej. promedios)
const avgTemp = useMemo(() => {
  return (stats.cpuTemp + stats.gpuTemp) / 2;
}, [stats.cpuTemp, stats.gpuTemp]);

// ✅ useCallback para funciones de control
const handleSetTurbo = useCallback(() => {
  window.electronAPI.setTurboMode(true).catch(console.error);
}, []); // La API del 'preload' es estable
```

### Backend (Main)

```typescript
// ✅ Usar exec de child_process (asíncrono)
// ❌ Evitar execSync (bloquea el hilo principal)
async function getStats() {
  const { stdout } = await execAsync('lm-sensors');
  // ... parsear stdout
}

// ✅ Usar spawn para streams de datos
// Si el monitor de sistema corre continuamente, usar spawn
// para leer la salida (stdout) en tiempo real sin llenar el buffer.
function startMonitoring(onData: (data: string) => void) {
  const monitor = spawn('comando_de_monitor', ['-i', '1s']);
  
  monitor.stdout.on('data', (data) => {
    onData(data.toString());
  });
  
  monitor.stderr.on('data', (data) => {
    logger.error(`Monitor stderr: ${data}`);
  });
}