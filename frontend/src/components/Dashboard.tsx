import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
} from '@/store/slices/statsSlice';
import {
  setModeStart,
  setModeSuccess,
  setModeFailure,
  setTurboStart,
  setTurboSuccess,
  setTurboFailure,
} from '@/store/slices/profilesSlice';
import {
  setFanSpeedStart,
  setFanSpeedSuccess,
  setFanSpeedFailure,
  setAutoModeStart,
  setAutoModeSuccess,
  setAutoModeFailure,
} from '@/store/slices/fansSlice';
import { statsApi, profilesApi, fansApi } from '@/services/api';
import StatCard from '@/components/StatCard';
import FanSlider from '@/components/FanSlider';
import ProfileSelector from '@/components/ProfileSelector';
import type { PerformanceMode, FanType } from '@/types';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.stats);
  const profiles = useAppSelector((state) => state.profiles);
  const fans = useAppSelector((state) => state.fans);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Poll every 2 seconds
    const interval = setInterval(fetchStats, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      dispatch(fetchStatsStart());
      const data = await statsApi.getStats();
      dispatch(fetchStatsSuccess(data));
    } catch (error) {
      dispatch(fetchStatsFailure((error as Error).message));
    }
  };

  const handleModeChange = async (mode: PerformanceMode) => {
    try {
      dispatch(setModeStart());
      await profilesApi.setPerformanceMode(mode);
      dispatch(setModeSuccess(mode));
    } catch (error) {
      dispatch(setModeFailure((error as Error).message));
    }
  };

  const handleTurboToggle = async (enabled: boolean) => {
    try {
      dispatch(setTurboStart());
      await profilesApi.setTurboMode(enabled);
      dispatch(setTurboSuccess(enabled));
    } catch (error) {
      dispatch(setTurboFailure((error as Error).message));
    }
  };

  const handleFanSpeedChange = async (fan: FanType, speed: number) => {
    try {
      dispatch(setFanSpeedStart());
      await fansApi.setFanSpeed(fan, speed);
      dispatch(setFanSpeedSuccess({ fan, speed }));
    } catch (error) {
      dispatch(setFanSpeedFailure((error as Error).message));
    }
  };

  const handleAutoMode = async () => {
    try {
      dispatch(setAutoModeStart());
      await fansApi.setAutoMode();
      dispatch(setAutoModeSuccess());
    } catch (error) {
      dispatch(setAutoModeFailure((error as Error).message));
    }
  };

  const isLoading = stats.loading || profiles.loading || fans.loading;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-predator-blue to-predator-red bg-clip-text text-transparent mb-2">
            Predator Control Center
          </h1>
          <p className="text-gray-400">Hardware monitoring and control for Acer Predator laptops</p>
        </header>

        {/* Error Messages */}
        {(stats.error || profiles.error || fans.error) && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-center">
            <p className="text-red-200">
              ⚠️ {stats.error || profiles.error || fans.error}
            </p>
          </div>
        )}

        {/* System Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-4">System Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="CPU Temperature"
              value={stats.data?.cpu.temperature || 0}
              unit="°C"
              icon="🌡️"
            />
            <StatCard
              title="CPU Usage"
              value={stats.data?.cpu.usage || 0}
              unit="%"
              icon="🖥️"
            />
            <StatCard
              title="GPU Temperature"
              value={stats.data?.gpu.temperature || 0}
              unit="°C"
              icon="🌡️"
            />
            <StatCard
              title="GPU Usage"
              value={stats.data?.gpu.usage || 0}
              unit="%"
              icon="🎮"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Profile */}
          <section>
            <ProfileSelector
              currentMode={profiles.currentMode}
              turboEnabled={profiles.turboEnabled}
              onModeChange={handleModeChange}
              onTurboToggle={handleTurboToggle}
              disabled={isLoading}
            />
          </section>

          {/* Fan Control */}
          <section>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Fan Control</h2>
                <button
                  onClick={handleAutoMode}
                  disabled={isLoading}
                  className={`
                    px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      fans.autoMode
                        ? 'bg-predator-blue text-predator-dark'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }
                  `}
                >
                  {fans.autoMode ? '✓ Auto Mode' : 'Enable Auto'}
                </button>
              </div>

              <FanSlider
                fan="cpu"
                speed={fans.cpuSpeed}
                disabled={fans.autoMode || isLoading}
                onSpeedChange={handleFanSpeedChange}
              />

              <FanSlider
                fan="gpu"
                speed={fans.gpuSpeed}
                disabled={fans.autoMode || isLoading}
                onSpeedChange={handleFanSpeedChange}
              />
            </div>
          </section>
        </div>

        {/* GPU VRAM */}
        {stats.data?.gpu.vram && (
          <section className="card">
            <h3 className="text-xl font-bold mb-4">GPU VRAM Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {stats.data.gpu.vram.used.toFixed(0)} MB / {stats.data.gpu.vram.total.toFixed(0)} MB
                </span>
                <span className="text-predator-blue font-semibold">
                  {((stats.data.gpu.vram.used / stats.data.gpu.vram.total) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-predator-blue to-predator-red h-full transition-all duration-300"
                  style={{
                    width: `${(stats.data.gpu.vram.used / stats.data.gpu.vram.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Fan RPM Display */}
        {stats.data?.fans && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Fan Speed (RPM)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard
                title="CPU Fan"
                value={stats.data.fans.cpu}
                unit="RPM"
                icon="💨"
              />
              <StatCard
                title="GPU Fan"
                value={stats.data.fans.gpu}
                unit="RPM"
                icon="💨"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
