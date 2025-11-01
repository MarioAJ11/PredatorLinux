import type { PerformanceMode } from '@/types';

interface ProfileSelectorProps {
  currentMode: PerformanceMode;
  turboEnabled: boolean;
  onModeChange: (mode: PerformanceMode) => void;
  onTurboToggle: (enabled: boolean) => void;
  disabled: boolean;
}

const modes: Array<{ value: PerformanceMode; label: string; icon: string }> = [
  { value: 'quiet', label: 'Quiet', icon: '🌙' },
  { value: 'balanced', label: 'Balanced', icon: '⚖️' },
  { value: 'performance', label: 'Performance', icon: '⚡' },
  { value: 'turbo', label: 'Turbo', icon: '🚀' },
];

export default function ProfileSelector({
  currentMode,
  turboEnabled,
  onModeChange,
  onTurboToggle,
  disabled,
}: ProfileSelectorProps) {
  return (
    <div className="card space-y-6">
      <h2 className="text-2xl font-bold text-center">Performance Profile</h2>

      <div className="grid grid-cols-2 gap-4">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onModeChange(mode.value)}
            disabled={disabled}
            className={`
              p-4 rounded-lg font-semibold transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                currentMode === mode.value
                  ? 'bg-predator-blue text-predator-dark shadow-lg shadow-predator-blue/50'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }
            `}
          >
            <div className="text-3xl mb-2">{mode.icon}</div>
            <div className="text-sm">{mode.label}</div>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-6">
        <button
          onClick={() => onTurboToggle(!turboEnabled)}
          disabled={disabled}
          className={`
            w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              turboEnabled
                ? 'bg-predator-red text-white shadow-lg shadow-predator-red/50'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }
          `}
        >
          {turboEnabled ? '🔥 TURBO ENABLED' : '💨 Enable Turbo'}
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Turbo mode overrides performance profiles for maximum power
        </p>
      </div>
    </div>
  );
}
