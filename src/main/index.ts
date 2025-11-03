import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { StatsService } from './services/stats-service';
import { FanControlService } from './services/fan-control-service';
import { ProfileService } from './services/profile-service';
import { GuardianService } from './services/guardian-service';
import { RgbService } from './services/rgb-service';
import type { PerformanceProfile, RgbConfig, FanType } from '../types';

let mainWindow: BrowserWindow | null = null;
let statsService: StatsService;
let fanControlService: FanControlService;
let profileService: ProfileService;
let guardianService: GuardianService;
let rgbService: RgbService;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    title: 'PredatorLinux Control Center',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../../assets/icon.png'),
  });

  // Inicializar servicios
  statsService = new StatsService(mainWindow);
  fanControlService = new FanControlService();
  rgbService = new RgbService();
  profileService = new ProfileService(fanControlService, rgbService);
  guardianService = new GuardianService(mainWindow, fanControlService);

  // Iniciar monitoreo
  statsService.startMonitoring();
  guardianService.start();

  // Suscribirse a actualizaciones de stats para el guardián
  mainWindow.webContents.on('ipc-message', (event, channel, stats) => {
    if (channel === 'stats:update') {
      guardianService.updateStats(stats);
    }
  });

  // Cargar la aplicación
  const isDev = process.argv.includes('--dev') || !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      console.error('[Main] No se pudo conectar a Vite. Asegúrate de que el servidor esté corriendo.');
    });
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    statsService.stopMonitoring();
    guardianService.stop();
    mainWindow = null;
  });
}

// --- IPC Handlers ---

ipcMain.handle('profile:apply', async (event, profile: PerformanceProfile) => {
  try {
    await profileService.applyProfile(profile);
    return { success: true };
  } catch (error: any) {
    console.error('[Main] Error aplicando perfil:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('profile:get-defaults', () => {
  return profileService.getDefaultProfiles();
});

ipcMain.handle('rgb:set', async (event, config: RgbConfig) => {
  try {
    await rgbService.setRgb(config);
    return { success: true };
  } catch (error: any) {
    console.error('[Main] Error configurando RGB:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fans:set-manual', async (event, fan: FanType, speed: number) => {
  try {
    await fanControlService.setFanSpeed(fan, speed);
    return { success: true };
  } catch (error: any) {
    console.error('[Main] Error configurando ventilador:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fans:set-auto', async () => {
  try {
    await fanControlService.setAutoMode();
    return { success: true };
  } catch (error: any) {
    console.error('[Main] Error activando modo auto:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('turbo:set', async (event, enable: boolean) => {
  try {
    await profileService.setTurboMode(enable);
    return { success: true };
  } catch (error: any) {
    console.error('[Main] Error configurando turbo:', error);
    return { success: false, error: error.message };
  }
});

// --- App Lifecycle ---

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (statsService) statsService.stopMonitoring();
  if (guardianService) guardianService.stop();
});
