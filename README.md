# PredatorLinux - Control Center# PredatorLinux



**Aplicación de escritorio nativa para Linux** que replica la funcionalidad de **PredatorSense** para portátiles Acer Predator (como el PH-317-55).Sistema de control y monitoreo para laptops Acer Predator en Linux. Permite gestionar el rendimiento, ventiladores, modo turbo y monitorear temperaturas en tiempo real a través de una interfaz web moderna.



> ⚠️ **IMPORTANTE**: Este proyecto usa `sudo-prompt` para pedir permisos de forma segura. NO requiere modificar `sudoers` y es seguro para cualquier usuario.## 🚀 Características



## 🚀 Características- **Monitoreo en tiempo real**: Temperaturas de CPU/GPU, uso, RPM de ventiladores, VRAM

- **Control de perfiles de rendimiento**: Quiet, Balanced, Performance, Turbo

- **Monitor en Tiempo Real**: Temperaturas (CPU/GPU), uso, RPM de ventiladores- **Modo Turbo**: Activación/desactivación del modo turbo del sistema

- **Perfiles de Rendimiento**: Silencioso, Equilibrado, Rendimiento- **Control manual de ventiladores**: Ajuste de velocidad de ventiladores CPU y GPU (0-100%)

- **Control de Ventiladores**: Manual o automático- **Modo automático de ventiladores**: Gestión automática por el sistema

- **Modo Turbo**: Activar/desactivar Intel Turbo Boost- **Interfaz moderna**: Dashboard web con React, Tailwind CSS y Redux Toolkit

- **Control RGB**: Efectos y colores del teclado (si está soportado)- **API REST**: Backend con Express y TypeScript

- **🛡️ Guardián de Seguridad**: Protección automática contra sobrecalentamiento

## 📋 Requisitos

## 📋 Requisitos

- Node.js v20.19+ (para Vite en el frontend)

- **Node.js v20+** (recomendado usar nvm)- Node.js v12+ (compatible con el backend, pero se recomienda v16+)

- **Pop!_OS / Ubuntu / Debian** (o cualquier distro basada en systemd)- Linux con soporte para:

- **lm-sensors**: `sudo apt install lm-sensors`  - `lm-sensors` (monitoreo de temperaturas)

- **nvidia-smi**: Drivers de NVIDIA instalados (si tienes GPU NVIDIA)  - `nvidia-smi` (para GPUs NVIDIA)

- **Permisos**: La app pedirá tu contraseña con `sudo-prompt` cuando sea necesario  - Acceso root para modificar archivos del sistema (modo turbo, ventiladores)



## 🛠️ Instalación## 🛠️ Instalación



### 1. Instalar Node.js v20 con nvm### 1. Instalar Node.js v20 con nvm



```bash```bash

# Instalar nvm# Instalar nvm

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bashcurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

source ~/.bashrcsource ~/.bashrc



# Instalar Node.js v20# Instalar Node.js v20 (LTS)

nvm install 20nvm install 20

nvm use 20nvm use 20

node --version  # Debe mostrar v20.x.xnode --version  # Debería mostrar v20.x.x

``````



### 2. Clonar el repositorio### 2. Clonar e instalar dependencias



```bash```bash

git clone https://github.com/MarioAJ11/PredatorLinux.git# Backend

cd PredatorLinuxcd backend

```npm install



### 3. Instalar dependencias# Frontend

cd ../frontend

```bashnpm install

npm install```

```

## 🚀 Uso

Este comando instalará todas las dependencias necesarias:

- Electron (para la app de escritorio)### Modo Desarrollo

- React + Redux Toolkit (frontend)

- Tailwind CSS (estilos)Abrir dos terminales:

- sudo-prompt (para permisos seguros)

- Y más...**Terminal 1 - Backend** (Puerto 8080):

```bash

### 4. Configurar sensorscd backend

npm run dev

```bash```

# Detectar sensores

sudo sensors-detect**Terminal 2 - Frontend** (Puerto 5173):

```bash

# Verificar que funciona# Asegurarse de usar Node.js v20

sensorsexport NVM_DIR="$HOME/.nvm"

```[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use 20

## 🎮 Uso

cd frontend

### Modo Desarrollonpm run dev

```

```bash

npm run devLuego abrir en el navegador: **http://localhost:5173**

```

### Modo Producción

Esto iniciará:

1. Vite (frontend) en el puerto 5173```bash

2. Electron (app de escritorio)# Compilar frontend

cd frontend

La ventana de DevTools estará abierta para debugging.npm run build



### Compilar para Producción# El backend servirá los archivos estáticos compilados

cd ../backend

```bashnpm start

npm run build:linux```

```

## 📁 Estructura del Proyecto

Esto generará:

- **AppImage** en `release/PredatorLinux-x.x.x.AppImage````

- **.deb** en `release/predatorlinux_x.x.x_amd64.deb`PredatorLinux/

├── backend/

### Instalar el .deb│   ├── src/

│   │   ├── controllers/         # Controladores de rutas

```bash│   │   ├── services/             # Lógica de negocio

sudo dpkg -i release/predatorlinux_x.x.x_amd64.deb│   │   ├── routes/               # Definición de rutas

```│   │   ├── middlewares/          # Error handlers

│   │   ├── types/                # TypeScript types

Luego busca "PredatorLinux" en el menú de aplicaciones.│   │   ├── utils/                # Constantes y utilidades

│   │   └── index.ts              # Punto de entrada

## 🔧 Configuración│   ├── package.json

│   └── tsconfig.json

### Rutas del Sistema (si necesitas ajustarlas)│

└── frontend/

Las rutas de control de hardware pueden variar según tu modelo. Edita estos archivos si es necesario:    ├── src/

    │   ├── components/           # Componentes React

- **Ventiladores**: `src/main/services/fan-control-service.ts`    │   ├── store/                # Redux Toolkit slices y store

  ```typescript    │   ├── services/             # API client (Axios)

  const FAN_PATHS = {    │   ├── types/                # TypeScript types

    cpu: {    │   ├── App.tsx

      mode: '/sys/devices/platform/acer-wmi/hwmon/hwmon4/pwm1_enable',    │   └── main.tsx

      speed: '/sys/devices/platform/acer-wmi/hwmon/hwmon4/pwm1',    ├── tailwind.config.js

    },    ├── vite.config.ts

    // ...    └── package.json

  };```

  ```

## 🔌 API Endpoints

- **Modo Turbo**: `src/main/services/profile-service.ts`

  ```typescript### Health Check

  const TURBO_MODE_PATH = '/sys/devices/system/cpu/intel_pstate/no_turbo';- `GET /health` - Estado del servidor

  ```

### Estadísticas del Sistema

Para encontrar las rutas correctas:- `GET /api/stats` - Obtener temperaturas, uso de CPU/GPU, ventiladores, VRAM

```bash

# Buscar archivos de ventilador### Perfiles de Rendimiento

find /sys -name "pwm*" 2>/dev/null- `POST /api/profiles/turbo` - Activar/desactivar modo turbo

  ```json

# Buscar hwmon  { "enable": true }

ls -la /sys/devices/platform/*/hwmon/  ```

```- `POST /api/profiles/mode` - Cambiar modo de rendimiento

  ```json

### Control RGB (opcional)  { "mode": "turbo" | "performance" | "balanced" | "quiet" }

  ```

El control RGB depende de herramientas disponibles:

- **OpenRGB**: `sudo apt install openrgb`### Control de Ventiladores

- **Scripts personalizados**: Edita `src/main/services/rgb-service.ts`- `POST /api/fans/speed` - Establecer velocidad manual del ventilador

  ```json

## 🛡️ Guardián de Seguridad  { "fan": "cpu" | "gpu", "speed": 75 }

  ```

El Guardián monitorea las temperaturas cada 2 segundos:- `POST /api/fans/auto` - Activar modo automático de ventiladores

- Si **CPU > 95°C** o **GPU > 90°C**: Fuerza ventiladores al 100%

- Muestra advertencia en la UI## ⚙️ Configuración

- Se desactiva automáticamente cuando las temperaturas normalizan

### Modo Desarrollo vs Producción

## 📁 Estructura del Proyecto

El backend detecta automáticamente si está en desarrollo:

```- **Desarrollo**: Simula comandos del sistema (no requiere permisos root)

PredatorLinux/- **Producción**: Ejecuta comandos reales del sistema (requiere permisos root)

├── src/

│   ├── main/                 # Proceso principal de Electron (Node.js)Para cambiar manualmente, editar `backend/src/services/profile-service.ts`:

│   │   ├── services/         # Lógica de control de hardware```typescript

│   │   └── index.ts          # Punto de entradaconst isDevelopmentMode = process.env.NODE_ENV !== 'production';

│   ├── preload/              # Puente seguro Main ↔ Renderer```

│   │   └── index.ts          # API expuesta a React

│   ├── renderer/             # Frontend React### Permisos Root (Producción)

│   │   ├── components/       # Componentes UI

│   │   ├── store/            # Redux ToolkitAlgunos comandos requieren `sudo`. Opciones:

│   │   ├── hooks/            # Hooks personalizados

│   │   └── App.tsx1. **Ejecutar con sudo** (no recomendado para producción):

│   └── types/                # TypeScript types compartidos   ```bash

├── vite.config.ts            # Configuración de Vite   sudo npm start

├── tsconfig.json             # TypeScript config (Renderer)   ```

├── tsconfig.node.json        # TypeScript config (Main/Preload)

└── package.json              # Dependencias y scripts2. **Configurar sudoers** (recomendado):

```   ```bash

   sudo visudo

## 🔐 Seguridad   ```

   Agregar:

Esta aplicación usa **`sudo-prompt`** para pedir permisos de forma segura:   ```

- Muestra un diálogo nativo de Pop!_OS pidiendo tu contraseña   tuusuario ALL=(ALL) NOPASSWD: /usr/bin/tee /sys/devices/system/cpu/intel_pstate/no_turbo

- **NO modifica sudoers**   tuusuario ALL=(ALL) NOPASSWD: /usr/bin/nvidia-smi

- **NO almacena contraseñas**   ```

- Solo ejecuta comandos específicos cuando el usuario lo aprueba

## 🎨 Tecnologías

## ⚠️ Solución de Problemas

### Backend

### "Permission denied" al controlar ventiladores- **Express.js** - Framework web

```bash- **TypeScript** - Tipado estático

# Verifica que las rutas existan- **Zod** - Validación de esquemas

ls -la /sys/devices/platform/acer-wmi/- **child_process** - Ejecución de comandos del sistema



# Si no existen, busca la correcta:### Frontend

find /sys -name "pwm1" 2>/dev/null- **React 18** - Librería UI

```- **Vite** - Build tool y dev server

- **TypeScript** - Tipado estático

### No muestra temperaturas- **Tailwind CSS** - Framework CSS

```bash- **Redux Toolkit** - Gestión de estado

# Instala y configura lm-sensors- **Axios** - Cliente HTTP

sudo apt install lm-sensors

sudo sensors-detect## 🐛 Solución de Problemas

sensors

```### Error: `EADDRINUSE: address already in use :::8080`

```bash

### GPU NVIDIA no detectada# Matar proceso en puerto 8080

```bashpkill -f "ts-node-dev"

# Instala drivers propietarios# o

ubuntu-drivers deviceslsof -ti:8080 | xargs kill -9

sudo ubuntu-drivers autoinstall```



# Verifica nvidia-smi### Error: `Vite requires Node.js version 20.19+`

nvidia-smi```bash

```# Verificar versión de Node

node --version

### Electron no inicia

```bash# Si es menor a v20, activar nvm

# Verifica versión de Node.jsexport NVM_DIR="$HOME/.nvm"

node --version  # Debe ser v20+[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use 20

# Reinstala dependencias```

rm -rf node_modules package-lock.json

npm install### Error: `No se encuentra el módulo "@/types"`

``````bash

# Verificar que tsconfig tenga path aliases configurados

## 📚 Documentación Adicional# Reinstalar dependencias

cd frontend

- [Instrucciones para Copilot](.github/copilot-instructions.md) - Guía completa de la arquitecturarm -rf node_modules package-lock.json

- [Electron Docs](https://www.electronjs.org/docs/latest/)npm install

- [Redux Toolkit](https://redux-toolkit.js.org/)```



## 🤝 Contribuciones## 📝 Notas Importantes



Las contribuciones son bienvenidas. Por favor, sigue las convenciones del código existente.- **Modo desarrollo**: El backend simula comandos y devuelve datos falsos. Perfecto para probar la UI sin hardware real.

- **Permisos**: En producción, se necesitan permisos root para modificar configuraciones del sistema.

## 📄 Licencia- **Compatibilidad**: Diseñado para laptops Acer Predator en Linux. Puede requerir ajustes para otros modelos.

- **Sensores**: Requiere `lm-sensors` configurado (`sensors-detect`).

MIT License- **GPU NVIDIA**: Requiere drivers propietarios y `nvidia-smi` instalado.



## ⚡ Estado del Proyecto## 📚 Documentación Adicional



🚧 **En Desarrollo Activo** - Funcionalidad básica completa, se están agregando más características.- [API_EXAMPLES.md](backend/API_EXAMPLES.md) - Ejemplos de uso de la API con curl

- [README.md del Backend](backend/README.md) - Documentación detallada del backend

---- [README.md del Frontend](frontend/README.md) - Documentación del frontend



**Desarrollado para la comunidad de usuarios de Acer Predator en Linux** 🐧⚡## 🤝 Contribuciones


Las contribuciones son bienvenidas. Por favor, sigue las convenciones del código existente.

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 🙏 Créditos

Desarrollado para la comunidad de usuarios de Acer Predator en Linux.
