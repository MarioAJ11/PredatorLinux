# 🎮 PredatorLinux Control Center

Aplicación de escritorio nativa para control completo del hardware de portátiles **Acer Predator** en Linux.

## ✨ Características

- 🌡️ **Monitoreo en Tiempo Real**: Temperaturas CPU/GPU, uso de recursos, velocidades de ventiladores
- ⚙️ **Perfiles de Rendimiento**: Silencioso, Equilibrado y Rendimiento con un clic
- 🌀 **Control de Ventiladores**: Modo automático o control manual preciso
- 💡 **Control RGB**: Efectos y colores personalizables para teclado RGB
- 🛡️ **Guardian de Seguridad**: Protección automática contra sobrecalentamiento
- 🚀 **Modo Turbo**: Activar/desactivar Intel Turbo Boost

## 📋 Requisitos

```bash
sudo apt install lm-sensors
sudo sensors-detect
```

## 🚀 Desarrollo

```bash
npm install
npm run dev:vite  # Terminal 1
npm run build:electron && npx electron . --dev  # Terminal 2
```

## 📦 Build

```bash
npm run build:linux  # Genera .deb y AppImage
```

## 🔐 Seguridad

Usa `sudo-prompt` para solicitar privilegios solo cuando es necesario.
