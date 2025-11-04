import React from 'react';
import { useAppSelector } from '../store/hooks';
import ProfileSwitcher from './ProfileSwitcher';
import FanControl from './FanControl';
import RgbEditor from './RgbEditor';

const Dashboard: React.FC = () => {
  const stats = useAppSelector((state) => state.stats.current);
  const guardianWarning = useAppSelector((state) => state.ui.guardianWarning);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">
            PredatorLinux Control Center
          </h1>
          <p className="text-gray-400">
            Control completo de tu hardware Predator
          </p>
        </div>

        {/* Guardian Warning */}
        {guardianWarning && (
          <div className="p-4 rounded-lg mb-6 bg-red-900 border-2 border-red-500">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🛡️</span>
              <div>
                <h3 className="font-bold">Guardian de Seguridad</h3>
                <p className="text-sm opacity-75">{guardianWarning}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* CPU Temperature */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">CPU Temperatura</h3>
              <span className="text-2xl">🌡️</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {stats?.cpuTemp ? `${stats.cpuTemp.toFixed(1)}°C` : '--'}
            </div>
          </div>

          {/* GPU Temperature */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">GPU Temperatura</h3>
              <span className="text-2xl">🎮</span>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {stats?.gpuTemp ? `${stats.gpuTemp.toFixed(1)}°C` : '--'}
            </div>
          </div>

          {/* CPU Usage */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">CPU Uso</h3>
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">
              {stats?.cpuUsage ? `${stats.cpuUsage.toFixed(1)}%` : '--'}
            </div>
          </div>

          {/* GPU Usage */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">GPU Uso</h3>
              <span className="text-2xl">💻</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {stats?.gpuUsage ? `${stats.gpuUsage.toFixed(1)}%` : '--'}
            </div>
          </div>
        </div>

        {/* Fan Speeds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🌀</span>
              Ventilador CPU
            </h2>
            <div className="text-2xl font-bold text-blue-400">
              {stats?.fan1Rpm ? `${stats.fan1Rpm} RPM` : 'Sin lectura'}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🌀</span>
              Ventilador GPU
            </h2>
            <div className="text-2xl font-bold text-green-400">
              {stats?.fan2Rpm ? `${stats.fan2Rpm} RPM` : 'Sin lectura'}
            </div>
          </div>
        </div>

        {/* Profile Switcher */}
        <div className="mb-8">
          <ProfileSwitcher />
        </div>

        {/* Fan Control & RGB in Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FanControl />
          <RgbEditor />
        </div>

        {/* Status Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            {stats ? '✅ Monitoreo activo' : '⚠️ Esperando datos del sistema...'}
          </p>
          {stats && stats.cpuTemp === 0 && (
            <p className="mt-2 text-yellow-500">
              ⚠️ Temperaturas en 0: Verifica que lm-sensors esté configurado correctamente
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
