# PredatorLinux

Sistema de control y monitoreo para laptops Acer Predator en Linux. Permite gestionar el rendimiento, ventiladores, modo turbo y monitorear temperaturas en tiempo real a través de una interfaz web moderna.

## 🚀 Características

- **Monitoreo en tiempo real**: Temperaturas de CPU/GPU, uso, RPM de ventiladores, VRAM
- **Control de perfiles de rendimiento**: Quiet, Balanced, Performance, Turbo
- **Modo Turbo**: Activación/desactivación del modo turbo del sistema
- **Control manual de ventiladores**: Ajuste de velocidad de ventiladores CPU y GPU (0-100%)
- **Modo automático de ventiladores**: Gestión automática por el sistema
- **Interfaz moderna**: Dashboard web con React, Tailwind CSS y Redux Toolkit
- **API REST**: Backend con Express y TypeScript

## 📋 Requisitos

- Node.js v20.19+ (para Vite en el frontend)
- Node.js v12+ (compatible con el backend, pero se recomienda v16+)
- Linux con soporte para:
  - `lm-sensors` (monitoreo de temperaturas)
  - `nvidia-smi` (para GPUs NVIDIA)
  - Acceso root para modificar archivos del sistema (modo turbo, ventiladores)

## 🛠️ Instalación

### 1. Instalar Node.js v20 con nvm

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Instalar Node.js v20 (LTS)
nvm install 20
nvm use 20
node --version  # Debería mostrar v20.x.x
```

### 2. Clonar e instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 🚀 Uso

### Modo Desarrollo

Abrir dos terminales:

**Terminal 1 - Backend** (Puerto 8080):
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend** (Puerto 5173):
```bash
# Asegurarse de usar Node.js v20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

cd frontend
npm run dev
```

Luego abrir en el navegador: **http://localhost:5173**

### Modo Producción

```bash
# Compilar frontend
cd frontend
npm run build

# El backend servirá los archivos estáticos compilados
cd ../backend
npm start
```

## 📁 Estructura del Proyecto

```
PredatorLinux/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Controladores de rutas
│   │   ├── services/             # Lógica de negocio
│   │   ├── routes/               # Definición de rutas
│   │   ├── middlewares/          # Error handlers
│   │   ├── types/                # TypeScript types
│   │   ├── utils/                # Constantes y utilidades
│   │   └── index.ts              # Punto de entrada
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/           # Componentes React
    │   ├── store/                # Redux Toolkit slices y store
    │   ├── services/             # API client (Axios)
    │   ├── types/                # TypeScript types
    │   ├── App.tsx
    │   └── main.tsx
    ├── tailwind.config.js
    ├── vite.config.ts
    └── package.json
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Estado del servidor

### Estadísticas del Sistema
- `GET /api/stats` - Obtener temperaturas, uso de CPU/GPU, ventiladores, VRAM

### Perfiles de Rendimiento
- `POST /api/profiles/turbo` - Activar/desactivar modo turbo
  ```json
  { "enable": true }
  ```
- `POST /api/profiles/mode` - Cambiar modo de rendimiento
  ```json
  { "mode": "turbo" | "performance" | "balanced" | "quiet" }
  ```

### Control de Ventiladores
- `POST /api/fans/speed` - Establecer velocidad manual del ventilador
  ```json
  { "fan": "cpu" | "gpu", "speed": 75 }
  ```
- `POST /api/fans/auto` - Activar modo automático de ventiladores

## ⚙️ Configuración

### Modo Desarrollo vs Producción

El backend detecta automáticamente si está en desarrollo:
- **Desarrollo**: Simula comandos del sistema (no requiere permisos root)
- **Producción**: Ejecuta comandos reales del sistema (requiere permisos root)

Para cambiar manualmente, editar `backend/src/services/profile-service.ts`:
```typescript
const isDevelopmentMode = process.env.NODE_ENV !== 'production';
```

### Permisos Root (Producción)

Algunos comandos requieren `sudo`. Opciones:

1. **Ejecutar con sudo** (no recomendado para producción):
   ```bash
   sudo npm start
   ```

2. **Configurar sudoers** (recomendado):
   ```bash
   sudo visudo
   ```
   Agregar:
   ```
   tuusuario ALL=(ALL) NOPASSWD: /usr/bin/tee /sys/devices/system/cpu/intel_pstate/no_turbo
   tuusuario ALL=(ALL) NOPASSWD: /usr/bin/nvidia-smi
   ```

## 🎨 Tecnologías

### Backend
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **Zod** - Validación de esquemas
- **child_process** - Ejecución de comandos del sistema

### Frontend
- **React 18** - Librería UI
- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS
- **Redux Toolkit** - Gestión de estado
- **Axios** - Cliente HTTP

## 🐛 Solución de Problemas

### Error: `EADDRINUSE: address already in use :::8080`
```bash
# Matar proceso en puerto 8080
pkill -f "ts-node-dev"
# o
lsof -ti:8080 | xargs kill -9
```

### Error: `Vite requires Node.js version 20.19+`
```bash
# Verificar versión de Node
node --version

# Si es menor a v20, activar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
```

### Error: `No se encuentra el módulo "@/types"`
```bash
# Verificar que tsconfig tenga path aliases configurados
# Reinstalar dependencias
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notas Importantes

- **Modo desarrollo**: El backend simula comandos y devuelve datos falsos. Perfecto para probar la UI sin hardware real.
- **Permisos**: En producción, se necesitan permisos root para modificar configuraciones del sistema.
- **Compatibilidad**: Diseñado para laptops Acer Predator en Linux. Puede requerir ajustes para otros modelos.
- **Sensores**: Requiere `lm-sensors` configurado (`sensors-detect`).
- **GPU NVIDIA**: Requiere drivers propietarios y `nvidia-smi` instalado.

## 📚 Documentación Adicional

- [API_EXAMPLES.md](backend/API_EXAMPLES.md) - Ejemplos de uso de la API con curl
- [README.md del Backend](backend/README.md) - Documentación detallada del backend
- [README.md del Frontend](frontend/README.md) - Documentación del frontend

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue las convenciones del código existente.

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 🙏 Créditos

Desarrollado para la comunidad de usuarios de Acer Predator en Linux.
