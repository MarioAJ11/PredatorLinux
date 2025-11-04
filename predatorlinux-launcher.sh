#!/bin/bash
# PredatorLinux Launcher Script
# Lanza la aplicación PredatorLinux Control Center

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

# Verificar si ya está corriendo
if pgrep -f "electron.*PredatorLinux" > /dev/null; then
    echo "PredatorLinux ya está en ejecución"
    # Enfocar la ventana existente
    wmctrl -a "PredatorLinux" 2>/dev/null || true
    exit 0
fi

# Iniciar aplicación
export NODE_ENV=production
npx electron . --dev > /dev/null 2>&1 &

echo "PredatorLinux iniciado"
