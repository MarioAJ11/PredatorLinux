# PredatorLinux Backend

Backend API local para controlar hardware de portátil Predator.

## 🚀 Instalación

```bash
npm install
```

## 💻 Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:8080`

## 📝 Scripts

- `npm run dev` - Iniciar servidor en modo desarrollo con hot-reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar servidor en producción
- `npm run type-check` - Verificar tipos sin compilar

## 🔌 Endpoints

### Health Check
```
GET /health
```

**Respuesta:**
```json
{
  "success": true,
  "message": "PredatorLinux Backend API está funcionando",
  "timestamp": "2025-11-01T19:00:00.000Z"
}
```

---

### Estadísticas del Sistema

#### Obtener Estadísticas
```
GET /api/stats
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "cpuTemp": 55.2,
    "gpuTemp": 48.5,
    "systemTemp": 52.0,
    "fan1Rpm": 3200,
    "fan2Rpm": 3100,
    "cpuUsage": 45.3,
    "gpuUsage": 12.8
  }
}
```

---

### Control de Ventiladores

#### Establecer Velocidad de Ventilador
```
POST /api/fans/speed
Content-Type: application/json

{
  "fan": "cpu",     // "cpu" o "gpu"
  "speed": 75       // 0-100 (porcentaje)
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Ventilador cpu establecido a 75%"
}
```

#### Activar Modo Automático
```
POST /api/fans/auto
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Modo automático de ventiladores activado"
}
```

---

### Perfiles de Rendimiento

#### Activar/Desactivar Modo Turbo
```
POST /api/profiles/turbo
Content-Type: application/json

{
  "enable": true    // true o false
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Modo Turbo activado correctamente"
}
```

#### Establecer Perfil de Rendimiento
```
POST /api/profiles/mode
Content-Type: application/json

{
  "mode": "performance"    // "turbo" | "performance" | "balanced" | "quiet"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Perfil de rendimiento 'performance' aplicado correctamente"
}
```

**Modos disponibles:**
- **turbo**: Máximo rendimiento con turbo activado
- **performance**: Alto rendimiento sin turbo
- **balanced**: Balance entre rendimiento y consumo
- **quiet**: Modo silencioso, menor consumo

## ⚙️ Configuración de Permisos Sudo

Para que el servidor pueda ejecutar comandos `sudo tee` sin contraseña, debes configurar `sudoers`:

```bash
sudo visudo
```

Añade la siguiente línea (reemplaza `tu_usuario` con tu nombre de usuario):

```
tu_usuario ALL=(ALL) NOPASSWD: /usr/bin/tee
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/       # Controladores de rutas
│   ├── middlewares/       # Middlewares personalizados
│   ├── routes/            # Definición de rutas
│   ├── services/          # Lógica de negocio
│   ├── types/             # Definiciones de tipos TypeScript
│   ├── utils/             # Utilidades y constantes
│   └── index.ts           # Punto de entrada
├── package.json
└── tsconfig.json
```
