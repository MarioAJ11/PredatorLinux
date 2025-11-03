import React from 'react';
import { useAppSelector } from '../store/hooks';

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
          <div className={`p-4 rounded-lg mb-6 ${
            guardianWarning.level === 'critical' 
              ? 'bg-red-900 border-2 border-red-500' 
              : 'bg-yellow-900 border-2 border-yellow-500'
          }`}>
            <div className="flex items-center">
              <span className="text-2xl mr-3">🛡️</span>
              <div>
                <h3 className="font-bold">Guardian: {guardianWarning.message}</h3>
                <p className="text-sm opacity-75">{guardianWarning.details}</p>
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
              CPU Fan
            </h2>
            <div className="text-2xl font-bold text-blue-400">
              {stats?.cpuFanSpeed ? `${stats.cpuFanSpeed} RPM` : 'N/A'}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🌀</span>
              GPU Fan
            </h2>
            <div className="text-2xl font-bold text-green-400">
              {stats?.gpuFanSpeed ? `${stats.gpuFanSpeed} RPM` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
          <div className="flex gap-4">
            <button className="btn-primary">
              🎯 Quiet
            </button>
            <button className="btn-primary">
              ⚡ Balanced
            </button>
            <button className="btn-primary">
              🚀 Performance
            </button>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            {stats ? '✅ Servicios activos' : '⚠️ Esperando datos...'}
          </p>
          <p className="mt-2">
            Para funcionalidad completa, instala: <code className="bg-gray-800 px-2 py-1 rounded">sudo apt install lm-sensors</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
