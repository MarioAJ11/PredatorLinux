# Configurar Tecla Predator

Esta guía te ayudará a configurar la **tecla Predator** de tu portátil para que lance PredatorLinux Control Center.

## 🎯 Método 1: Super + P (Ya Configurado)

✅ **Ya está listo:** Presiona `Super + P` para lanzar la aplicación.

- **Super** = Tecla Windows
- Configurado automáticamente por el script `setup-keybinding.sh`

## 🔥 Método 2: Tecla Predator Física

### Paso 1: Detectar el keycode de tu tecla Predator

```bash
# Instalar herramientas (si no están)
sudo apt install xbindkeys xdotool wmctrl

# Detectar keycode
xbindkeys -k
# Presiona la tecla Predator y copia la salida
```

### Paso 2: Editar configuración

La salida de `xbindkeys -k` te dará algo como:

```
"(Scheme function)"
    m:0x0 + c:156
    XF86Launch1
```

Copia esas 3 líneas y edita `~/.xbindkeysrc`:

```bash
nano ~/.xbindkeysrc
```

Reemplaza una de las líneas existentes con tu keycode detectado:

```scheme
# Tecla Predator detectada
"/home/mario/Documentos/Proyectos/PredatorLinux/predatorlinux-launcher.sh"
    m:0x0 + c:156    # <-- Tu keycode aquí
    XF86Launch1      # <-- Tu keysym aquí
```

### Paso 3: Reiniciar xbindkeys

```bash
pkill xbindkeys
xbindkeys -f ~/.xbindkeysrc
```

### Paso 4: Hacer permanente

xbindkeys ya está configurado para iniciarse automáticamente con tu sesión.

## 🎮 Método 3: Configurar Manualmente en GNOME

1. Abre **Configuración del Sistema**
2. Ve a **Teclado** → **Ver y personalizar atajos**
3. Desplázate hasta **Atajos personalizados**
4. Verás "PredatorLinux Control Center" con Super+P
5. Haz clic para cambiar y presiona tu **tecla Predator**

## 🔍 Troubleshooting

### La tecla Predator no hace nada

Verifica que la tecla sea detectada por el sistema:

```bash
# Método 1: evtest
sudo evtest
# Selecciona tu teclado y presiona la tecla Predator

# Método 2: xev
xev -event keyboard
# Presiona la tecla Predator y busca el keycode
```

### Códigos comunes de tecla Predator:

- **keycode 156** → XF86Launch1 (más común)
- **keycode 210** → XF86Launch4
- **keycode 179** → XF86Tools
- **keycode 152** → XF86Explorer

### La aplicación se abre múltiples veces

El script `predatorlinux-launcher.sh` ya incluye prevención de duplicados.
Si aún ocurre, ejecuta:

```bash
pkill -f "electron.*PredatorLinux"
```

## 🚀 Scripts Disponibles

- **`predatorlinux-launcher.sh`** - Lanzador principal (previene duplicados)
- **`setup-keybinding.sh`** - Configura Super+P automáticamente
- **`~/.xbindkeysrc`** - Configuración de atajos (tecla Predator)

## 📝 Notas

- xbindkeys se inicia automáticamente con tu sesión
- El atajo Super+P funciona inmediatamente
- Para la tecla Predator física, necesitas detectar el keycode específico de tu modelo

---

**¿Dudas?** Abre un issue en GitHub: https://github.com/MarioAJ11/PredatorLinux/issues
