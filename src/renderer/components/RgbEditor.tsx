import { useState } from 'react';
import type { RgbConfig } from '../../types';

const RgbEditor: React.FC = () => {
  const [config, setConfig] = useState<RgbConfig>({
    mode: 'wave',
    speed: 3,
    color: '#00D9FF',
  });
  const [applying, setApplying] = useState(false);

  const modes: Array<{ id: RgbConfig['mode']; name: string; icon: string }> = [
    { id: 'static', name: 'Estático', icon: '💡' },
    { id: 'breathing', name: 'Respiración', icon: '🫁' },
    { id: 'wave', name: 'Ola', icon: '🌊' },
    { id: 'off', name: 'Apagado', icon: '⚫' },
  ];

  const presetColors = [
    { name: 'Predator Azul', hex: '#00D9FF' },
    { name: 'Rojo', hex: '#FF0044' },
    { name: 'Verde', hex: '#00FF00' },
    { name: 'Morado', hex: '#AA00FF' },
    { name: 'Amarillo', hex: '#FFFF00' },
    { name: 'Naranja', hex: '#FF8800' },
    { name: 'Cyan', hex: '#00FFFF' },
    { name: 'Rosa', hex: '#FF1493' },
    { name: 'Blanco', hex: '#FFFFFF' },
  ];

  const handleApply = async () => {
    setApplying(true);
    try {
      const result = await window.electronAPI.setRgb(config);
      if (!result.success) {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error aplicando RGB:', error);
      alert('Error al aplicar configuración RGB');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-predator-blue">
        Control RGB del Teclado
      </h2>

      {/* Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3 text-gray-300">
          Modo de Iluminación
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setConfig({ ...config, mode: mode.id })}
              disabled={applying}
              className={`
                p-4 rounded-lg transition-all font-semibold
                ${config.mode === mode.id
                  ? 'bg-predator-blue text-predator-dark ring-2 ring-predator-blue scale-105'
                  : 'bg-predator-gray-light text-gray-300 hover:bg-predator-gray'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <div className="text-3xl mb-1">{mode.icon}</div>
              <div className="text-sm">{mode.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Speed Control (only if not off) */}
      {config.mode !== 'off' && (
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 text-gray-300">
            Velocidad del Efecto: <span className="text-predator-blue">{config.speed}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={config.speed}
            onChange={(e) => setConfig({ ...config, speed: parseInt(e.target.value) })}
            disabled={applying}
            className="input-range"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Lento</span>
            <span>Normal</span>
            <span>Rápido</span>
          </div>
        </div>
      )}

      {/* Color Selection (only if not off) */}
      {config.mode !== 'off' && (
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 text-gray-300">
            Color
          </label>
          
          {/* Preset Colors */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
            {presetColors.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => setConfig({ ...config, color: preset.hex })}
                disabled={applying}
                className={`
                  h-12 rounded-lg transition-all
                  ${config.color.toLowerCase() === preset.hex.toLowerCase()
                    ? 'ring-4 ring-white scale-110'
                    : 'hover:scale-105'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                style={{ backgroundColor: preset.hex }}
                title={preset.name}
              />
            ))}
          </div>

          {/* Custom Color Picker */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Color personalizado:</label>
            <input
              type="color"
              value={config.color}
              onChange={(e) => setConfig({ ...config, color: e.target.value })}
              disabled={applying}
              className="w-16 h-10 rounded cursor-pointer bg-transparent border-2 border-gray-600"
            />
            <span className="text-sm font-mono text-gray-400">{config.color.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="mb-6 p-6 bg-predator-gray-light rounded-lg">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Vista Previa</div>
          <div 
            className={`
              h-24 rounded-lg flex items-center justify-center text-4xl
              ${config.mode === 'breathing' ? 'animate-pulse' : ''}
              ${config.mode === 'off' ? 'bg-gray-900' : ''}
            `}
            style={{ 
              backgroundColor: config.mode !== 'off' ? config.color : undefined,
            }}
          >
            {config.mode === 'static' && '💡'}
            {config.mode === 'breathing' && '🫁'}
            {config.mode === 'wave' && '🌊'}
            {config.mode === 'off' && '⚫'}
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={applying}
        className="btn-primary w-full"
      >
        {applying ? '⏳ Aplicando...' : '✓ Aplicar Configuración RGB'}
      </button>

      {/* Warning */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
        <p className="text-xs text-blue-300">
          ℹ️ <strong>Nota:</strong> El control RGB en portátiles Predator puede variar según el modelo. 
          Si no ves cambios, es posible que tu modelo requiera drivers adicionales.
        </p>
      </div>
    </div>
  );
};

export default RgbEditor;
