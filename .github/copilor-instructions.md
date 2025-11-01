# Instrucciones para GitHub Copilot

## 🎯 Proyecto: PredatorLinux

**Objetivo:** Crear una aplicación full-stack (React + Node.js) que se ejecuta localmente para controlar el hardware de un portátil Predator.

**Funcionalidad Clave:**
- **Backend (Node.js):** Un servidor de API local (Express) que ejecuta comandos de terminal (`sudo tee`, `nvidia-smi`, `lm-sensors`) para controlar ventiladores, perfiles de rendimiento (Turbo), luces RGB y leer estadísticas del sistema.
- **Frontend (React):** Una interfaz gráfica de usuario que consume la API del backend para mostrar datos y enviar comandos de control.
- **NO hay autenticación de usuario** ni una base de datos SQL. Los perfiles se aplican directamente al sistema.

## 🥞 Stack Tecnológico

### Frontend
- **Framework:** React
- **Lenguaje:** TypeScript
- **UI Components:** Tailwind
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Validación:** Zod
- **Core Backend Logic:** `child_process` (para ejecutar comandos de shell)
- **API Base:** `http://localhost:8080` (el backend se ejecutará en este puerto)

---

## 📐 Convenciones de Código

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
const API_BASE_URL = "http://localhost:8080";
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

// ✅ Archivos de servicios/utils: kebab-case.ts
// profile-service.ts, system-stats.ts
````

### Estructura de Código

#### Imports

```typescript
// 1. Imports de librerías externas
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Imports internos (absolute paths)
import { ProfileService } from '@/services/profile-service';
import { Button } from '@/components/ui/Button';

// 3. Imports relativos
import { formatTemperature } from '../utils/formatters';

// 4. Imports de tipos
import type { SystemStats } from '@/types/System.types';

// 5. Imports de estilos
import './styles.css';
```

#### Componentes React

```typescript
/**
 * Componente para mostrar las estadísticas del sistema
 * @param props - Las estadísticas actuales del sistema
 */
interface StatsDashboardProps {
  stats: SystemStats;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  // 1. Hooks de estado
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // 3. Custom hooks
  // const { data: stats } = useSystemStats(); // Asumiendo un custom hook
  
  // 5. Funciones de manejo
  const formattedCpuTemp = `${stats.cpuTemp}°C`;
  
  // 7. Render
  return (
    <div className="p-4 rounded-lg bg-gray-800">
      <h3 className="text-white text-lg">System Monitor</h3>
      <p className="text-gray-300">CPU Temp: {formattedCpuTemp}</p>
      {/* ... más estadísticas */}
    </div>
  );
};
```

#### Servicios Backend

```typescript
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
    // ¡IMPORTANTE! Este comando requiere permisos 'sudo'.
    // El servidor Node.js debe tener permisos NOPASSWD en 'sudoers' para 'tee'.
    const command = `echo ${value} | sudo tee ${TURBO_MODE_PATH}`;
    
    try {
      const { stdout, stderr } = await execAsync(command);
      if (stderr) {
        throw new Error(stderr); // Lanza un error si hay salida de error
      }
      logger.info(`Modo Turbo ${enable ? 'activado' : 'desactivado'}.`);
    } catch (error) {
      logger.error('Error al ejecutar comando de modo turbo', { command, error });
      // Lanza un error personalizado para el middleware
      throw new Error(`ShellError: Error al cambiar el modo de rendimiento. ${error.message}`);
    }
  }
}
```

### Manejo de Errores

#### Frontend

```typescript
// Función para activar el modo turbo
const handleTurboClick = async () => {
  try {
    // Asumimos que profileService es una instancia de cliente API
    await profileService.setTurbo(true);
    // Asumimos que 'toast' es un sistema de notificaciones
    toast.success('¡Modo Turbo activado!');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Manejar errores de API
      toast.error(error.response?.data?.message || 'Error al contactar el servidor');
    } else {
      // Otros errores
      toast.error('Error inesperado');
    }
    console.error('Error:', error);
  }
};
```

#### Backend

```typescript
// Middleware de manejo de errores (en app.ts o index.ts)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error en petición', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  if (err instanceof ValidationError) { // Error de Zod
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }
  
  if (err.message.startsWith('ShellError:')) { // Error de child_process
    return res.status(500).json({
      success: false,
      message: 'Error al ejecutar comando en el servidor'
    });
  }
  
  // Error genérico
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});
```

### Async/Await

```typescript
// ✅ Preferir async/await
async function setProfile(mode: PerformanceMode) {
  // Asumimos profileService es un cliente API
  const response = await profileService.setProfile(mode);
  return response.data;
}

// ❌ Evitar .then()/.catch() cuando sea posible
function setProfile(mode: PerformanceMode) {
  return profileService.setProfile(mode)
    .then(response => response.data)
    .catch(error => console.error(error));
}
```

### TypeScript

#### Tipado Estricto

```typescript
// ✅ Tipar todo explícitamente
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

## 🔒 Seguridad

### Validación de Inputs

```typescript
// ✅ Siempre validar datos de entrada con Zod
import { z } from 'zod';

// Esquema para el body de POST /api/profiles/mode
const setModeSchema = z.object({
  mode: z.enum(['turbo', 'quiet', 'balanced', 'performance'], {
    required_error: "El modo es requerido",
  }),
});

// Esquema para POST /api/fans
const setFanSchema = z.object({
  fan: z.enum(['cpu', 'gpu']),
  speed: z.number().min(0).max(100) // Asumimos porcentaje
});

// En el controlador de Express:
// const validatedData = setModeSchema.parse(req.body);
```

-----

## 📝 Estructura de Respuestas API

### Formato Estándar

```typescript
// ✅ Respuesta exitosa
{
  "success": true,
  "data": {
    "cpuTemp": 55,
    "gpuTemp": 45
  },
  "message": "Estadísticas actualizadas"
}

// ✅ Respuesta con error
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "speed",
      "message": "La velocidad debe estar entre 0 y 100"
    }
  ]
}
```

-----

## 🧪 Testing

### Convenciones

```typescript
// ✅ Estructura de tests (ej. con Vitest)
describe('ProfileService', () => {
  describe('setTurboMode', () => {
    
    // Mockear child_process
    const mockExec = vi.fn();
    vi.mock('child_process', () => ({
      exec: (cmd, cb) => mockExec(cmd, cb),
    }));

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

### Frontend

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
  // Asumimos que 'profileService' está disponible
  profileService.setTurbo(true);
}, []);
```

### Backend

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