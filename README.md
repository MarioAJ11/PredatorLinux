# PredatorLinux Control Center# 🎮 PredatorLinux Control Center



<div align="center">Aplicación de escritorio nativa para control completo del hardware de portátiles **Acer Predator** en Linux.



![PredatorLinux](https://img.shields.io/badge/Predator-Linux-00D9FF?style=for-the-badge)## ✨ Características

![Electron](https://img.shields.io/badge/Electron-39.0.0-47848F?style=for-the-badge&logo=electron)

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)- 🌡️ **Monitoreo en Tiempo Real**: Temperaturas CPU/GPU, uso de recursos, velocidades de ventiladores

![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)- ⚙️ **Perfiles de Rendimiento**: Silencioso, Equilibrado y Rendimiento con un clic

- 🌀 **Control de Ventiladores**: Modo automático o control manual preciso

**Aplicación de escritorio nativa para controlar hardware de portátiles Acer Predator en Linux**- 💡 **Control RGB**: Efectos y colores personalizables para teclado RGB

- 🛡️ **Guardian de Seguridad**: Protección automática contra sobrecalentamiento

</div>- 🚀 **Modo Turbo**: Activar/desactivar Intel Turbo Boost



---## 📋 Requisitos



## 🎯 Características```bash

sudo apt install lm-sensors

✅ **Monitoreo en Tiempo Real** - CPU/GPU temp, uso, RPM ventiladores  sudo sensors-detect

✅ **3 Perfiles de Rendimiento** - Silencioso / Equilibrado / Máximo  ```

✅ **Control de Ventiladores** - Automático o manual con sliders  

✅ **RGB del Teclado** - Efectos y colores personalizables (experimental)  ## 🚀 Desarrollo

✅ **Guardián de Seguridad** - Protección contra sobrecalentamiento  

✅ **Modo Turbo Intel** - Activar/desactivar desde perfiles  ```bash

npm install

---npm run dev:vite  # Terminal 1

npm run build:electron && npx electron . --dev  # Terminal 2

## 📋 Requisitos```



- Pop!_OS / Ubuntu 22.04+ o derivados Debian## 📦 Build

- Portátil Acer Predator (probado en PH-317-55)

- Node.js v16+ (recomendado v20+)```bash

npm run build:linux  # Genera .deb y AppImage

**Instalar sensores:**```

```bash

sudo apt install lm-sensors## 🔐 Seguridad

sudo sensors-detect --auto

sudo modprobe coretempUsa `sudo-prompt` para solicitar privilegios solo cuando es necesario.

```

---

## 🚀 Instalación & Desarrollo

```bash
# Clonar
git clone https://github.com/MarioAJ11/PredatorLinux.git
cd PredatorLinux

# Instalar dependencias
npm install

# Desarrollo (2 terminales)
npm run dev:vite              # Terminal 1
npm run build:electron && npx electron . --dev  # Terminal 2
```

---

## 📦 Construir Paquetes

```bash
npm run build:linux  # Genera .deb y .AppImage
```

Instalar:
```bash
sudo dpkg -i release/predatorlinux_1.0.0_amd64.deb
```

---

## ⌨️ Lanzar con Tecla Predator

✅ **Ya configurado:** Presiona `Super + P` para abrir la aplicación

🔥 **Tecla Predator física:** Ver [KEYBINDING.md](KEYBINDING.md) para configurar la tecla turbo

```bash
# Detectar keycode de tu tecla Predator
xbindkeys -k
# Presiona la tecla y sigue instrucciones en KEYBINDING.md
```

---

## 🎮 Uso

### Cambiar Perfil
Haz clic en **Silencioso/Equilibrado/Rendimiento** → Se pedirá contraseña `sudo`

### Ventiladores Manuales
1. Cambiar a modo **Manual**
2. Ajustar sliders CPU/GPU (0-100%)
3. Botón emergencia para 100% instantáneo

### RGB del Teclado
1. Seleccionar modo (Estático/Respiración/Ola/Off)
2. Elegir color
3. Ajustar velocidad
4. Clic en "Aplicar"

> ⚠️ **RGB Experimental:** Control RGB limitado en Linux. Algunos modelos requieren drivers adicionales (`acer-wmi`, `acer-gkbbl`).

---

## 🛡️ Guardián de Seguridad

Monitorea cada 2 segundos:
- **CPU > 95°C** → Ventiladores al 100%
- **GPU > 90°C** → Ventiladores al 100%
- **Sistema > 85°C** → Ventiladores al 100%

---

## 🐛 Troubleshooting

### Sin temperaturas (0°C)
```bash
sensors -j  # Verificar salida
sudo sensors-detect --auto
sudo modprobe coretemp
echo "coretemp" | sudo tee -a /etc/modules
```

### Ventiladores no responden
Verificar rutas PWM:
```bash
find /sys/devices -name "pwm*" 2>/dev/null
ls /sys/devices/platform/acer-wmi/
```

Puede que necesites ajustar rutas en `src/main/services/fan-control-service.ts`

### RGB no funciona
```bash
ls /sys/class/acer-gkbbl*/
lsmod | grep acer
```

Control RGB en Predator+Linux es experimental. No todos los modelos tienen soporte completo.

---

## 🔧 Arquitectura

```
src/
├── main/          → Backend Node.js (stats, fans, profiles, guardian)
├── preload/       → Puente de seguridad (contextBridge)
├── renderer/      → Frontend React + Redux + Tailwind
└── types/         → Interfaces TypeScript
```

**Stack:** Electron + React + Redux Toolkit + Vite + TypeScript

---

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m 'Add: nueva funcionalidad'`
4. Push: `git push origin feature/mi-feature`
5. Abrir Pull Request

---

## ⚠️ Disclaimer

Este software interactúa con hardware del sistema. **Úsalo bajo tu propio riesgo.**

Recomendaciones:
- Monitorea temperaturas constantemente
- Mantén ventiladores en automático cuando no supervises
- No desactives el Guardián de Seguridad

---

## 📝 Licencia

ISC License

---

## 👨‍💻 Autor

**MarioAJ11** - [@MarioAJ11](https://github.com/MarioAJ11)

---

<div align="center">

**Hecho con ❤️ para la comunidad Predator en Linux**

⭐ Dale una estrella si te gusta!

</div>
