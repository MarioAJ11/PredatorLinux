/**
 * Constantes del sistema para control de hardware Predator
 */

// Rutas del sistema de archivos del kernel
export const TURBO_MODE_PATH = "/sys/module/acer_wmi/drivers/platform:acer-wmi/acer-wmi/predator_sense/turbo_mode";

// Límites de hardware
export const MAX_FAN_RPM = 6000;
export const MIN_FAN_RPM = 0;
export const MAX_FAN_SPEED_PERCENT = 100;
export const MIN_FAN_SPEED_PERCENT = 0;

// Configuración del servidor
export const API_BASE_URL = "http://localhost:8080";
export const SERVER_PORT = 8080;
