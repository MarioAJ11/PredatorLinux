import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import type { FanType } from '../../types';

const FanControl: React.FC = () => {
  const stats = useAppSelector((state) => state.stats.current);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [cpuSpeed, setCpuSpeed] = useState(50);
  const [gpuSpeed, setGpuSpeed] = useState(50);
  const [applying, setApplying] = useState(false);

  const handleModeChange = async (newMode: 'auto' | 'manual') => {
    setApplying(true);
    try {
      if (newMode === 'auto') {
        const result = await window.electronAPI.setAutoFanMode();
        if (result.success) {
          setMode('auto');
        } else {
          alert(`Error: ${result.error}`);
        }
      } else {
        setMode('manual');
      }
    } catch (error) {
      console.error('Error cambiando modo:', error);
      alert('Error al cambiar el modo de ventiladores');
    } finally {
      setApplying(false);
    }
  };

  const handleFanSpeedChange = async (fan: FanType, speed: number) => {
    if (mode !== 'manual') return;
    
    if (fan === 'cpu') {
      setCpuSpeed(speed);
    } else {
      setGpuSpeed(speed);
    }
  };

  const applyFanSpeed = async (fan: FanType, speed: number) => {
    if (mode !== 'manual') return;
    
    setApplying(true);
    try {
      const result = await window.electronAPI.setManualFanSpeed(fan, speed);
      if (!result.success) {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error aplicando velocidad:', error);
      alert('Error al aplicar la velocidad del ventilador');
    } finally {
      setApplying(false);
    }
  };

  const getSpeedColor = (speed: number) => {
    if (speed < 30) return 'text-blue-400';
    if (speed < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-predator-blue">
          Control de Ventiladores
        </h2>

        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange('auto')}
            disabled={applying}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-all
              ${mode === 'auto' 
                ? 'bg-predator-blue text-predator-dark' 
                : 'bg-predator-gray-light text-gray-400 hover:bg-predator-gray'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            🤖 Automático
          </button>
          <button
            onClick={() => handleModeChange('manual')}
            disabled={applying}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-all
              ${mode === 'manual' 
                ? 'bg-predator-red text-white' 
                : 'bg-predator-gray-light text-gray-400 hover:bg-predator-gray'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            🎛️ Manual
          </button>
        </div>
      </div>

      {/* Warning for Manual Mode */}
      {mode === 'manual' && (
        <div className="mb-6 p-4 bg-yellow-900/30 border-2 border-yellow-600 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ <strong>Modo Manual Activo:</strong> El sistema no ajustará automáticamente 
            los ventiladores. Asegúrate de mantener temperaturas seguras.
          </p>
        </div>
      )}

      {/* Fan Controls */}
      <div className="space-y-6">
        {/* CPU Fan */}
        <div className="p-4 bg-predator-gray-light rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">🌀 Ventilador CPU</h3>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getSpeedColor(mode === 'auto' ? 0 : cpuSpeed)}`}>
                {mode === 'auto' ? 'AUTO' : `${cpuSpeed}%`}
              </div>
              {stats && (
                <div className="text-xs text-gray-400">
                  {stats.fan1Rpm > 0 ? `${stats.fan1Rpm} RPM` : 'Sin lectura'}
                </div>
              )}
            </div>
          </div>

          {mode === 'manual' && (
            <div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={cpuSpeed}
                onChange={(e) => handleFanSpeedChange('cpu', parseInt(e.target.value))}
                onMouseUp={(e) => applyFanSpeed('cpu', parseInt((e.target as HTMLInputElement).value))}
                onTouchEnd={(e) => applyFanSpeed('cpu', parseInt((e.target as HTMLInputElement).value))}
                disabled={applying}
                className="input-range"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>

        {/* GPU Fan */}
        <div className="p-4 bg-predator-gray-light rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">🎮 Ventilador GPU</h3>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getSpeedColor(mode === 'auto' ? 0 : gpuSpeed)}`}>
                {mode === 'auto' ? 'AUTO' : `${gpuSpeed}%`}
              </div>
              {stats && (
                <div className="text-xs text-gray-400">
                  {stats.fan2Rpm > 0 ? `${stats.fan2Rpm} RPM` : 'Sin lectura'}
                </div>
              )}
            </div>
          </div>

          {mode === 'manual' && (
            <div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={gpuSpeed}
                onChange={(e) => handleFanSpeedChange('gpu', parseInt(e.target.value))}
                onMouseUp={(e) => applyFanSpeed('gpu', parseInt((e.target as HTMLInputElement).value))}
                onTouchEnd={(e) => applyFanSpeed('gpu', parseInt((e.target as HTMLInputElement).value))}
                disabled={applying}
                className="input-range"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Button */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <button
          onClick={() => {
            applyFanSpeed('cpu', 100);
            applyFanSpeed('gpu', 100);
            setCpuSpeed(100);
            setGpuSpeed(100);
          }}
          disabled={applying || mode === 'auto'}
          className="btn-danger w-full"
        >
          🚨 MÁXIMA VELOCIDAD (100%)
        </button>
      </div>

      {applying && (
        <div className="mt-4 text-center text-yellow-400 text-sm animate-pulse">
          ⏳ Aplicando cambios... Puede solicitar contraseña sudo
        </div>
      )}
    </div>
  );
};

export default FanControl;
