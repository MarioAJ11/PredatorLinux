#!/bin/bash
# Script para configurar atajo de teclado en GNOME/Pop!_OS
# Vincula Super+P a PredatorLinux

LAUNCHER="/home/mario/Documentos/Proyectos/PredatorLinux/predatorlinux-launcher.sh"

echo "Configurando atajo de teclado Super+P para PredatorLinux..."

# Crear atajo personalizado en GNOME
gsettings set org.gnome.settings-daemon.plugins.media-keys custom-keybindings \
  "['/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/predatorlinux/']"

# Configurar el atajo
gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/predatorlinux/ \
  name 'PredatorLinux Control Center'

gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/predatorlinux/ \
  command "$LAUNCHER"

gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/predatorlinux/ \
  binding '<Super>p'

echo "✓ Atajo configurado: Super+P lanza PredatorLinux"
echo ""
echo "Para probar, presiona: Super + P"
echo ""
echo "También puedes cambiar el atajo en:"
echo "Configuración → Teclado → Ver y personalizar atajos → Atajos personalizados"
