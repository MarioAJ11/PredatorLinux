import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActiveProfile, setProfiles } from '../store/profileSlice';
import type { PerformanceProfile } from '../../types';

const ProfileSwitcher: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeProfileId = useAppSelector((state) => state.profile.activeProfileId);
  const profiles = useAppSelector((state) => state.profile.profiles);
  const [applying, setApplying] = useState(false);

  // Cargar perfiles al montar
  useEffect(() => {
    const loadProfiles = async () => {
      const defaultProfiles = await window.electronAPI.getDefaultProfiles();
      dispatch(setProfiles(defaultProfiles));
    };
    loadProfiles();
  }, [dispatch]);

  const handleProfileSelect = async (profile: PerformanceProfile) => {
    if (applying || profile.id === activeProfileId) return;
    
    setApplying(true);
    try {
      const result = await window.electronAPI.applyProfile(profile);
      
      if (result.success) {
        dispatch(setActiveProfile(profile.id));
      } else {
        console.error('Error al aplicar perfil:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error aplicando perfil:', error);
      alert('Error al aplicar el perfil');
    } finally {
      setApplying(false);
    }
  };

  const getProfileIcon = (profileId: string) => {
    switch (profileId) {
      case 'quiet': return '🌙';
      case 'balanced': return '⚖️';
      case 'performance': return '🔥';
      default: return '⚙️';
    }
  };

  const getProfileColor = (profileId: string) => {
    switch (profileId) {
      case 'quiet': return 'from-blue-600 to-blue-800';
      case 'balanced': return 'from-cyan-600 to-cyan-800';
      case 'performance': return 'from-red-600 to-red-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-predator-blue">
        Perfiles de Rendimiento
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          
          return (
            <button
              key={profile.id}
              onClick={() => handleProfileSelect(profile)}
              disabled={applying || isActive}
              className={`
                relative overflow-hidden rounded-xl p-6 transition-all duration-300
                bg-gradient-to-br ${getProfileColor(profile.id)}
                ${isActive 
                  ? 'ring-4 ring-predator-blue scale-105 shadow-2xl' 
                  : 'hover:scale-105 hover:shadow-xl opacity-80 hover:opacity-100'
                }
                ${applying ? 'cursor-wait opacity-50' : 'cursor-pointer'}
                disabled:cursor-not-allowed
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-predator-blue rounded-full animate-pulse" />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col items-center space-y-3">
                <span className="text-5xl">{getProfileIcon(profile.id)}</span>
                <h3 className="text-xl font-bold text-white">
                  {profile.name}
                </h3>
                
                {/* Profile Details */}
                <div className="text-xs text-gray-200 space-y-1 w-full text-left">
                  <div className="flex justify-between">
                    <span>Turbo:</span>
                    <span className="font-semibold">
                      {profile.turboMode ? '✓ Activado' : '✗ Desactivado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ventiladores:</span>
                    <span className="font-semibold capitalize">{profile.fanMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Governor:</span>
                    <span className="font-semibold capitalize">{profile.cpuGovernor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RGB:</span>
                    <span className="font-semibold capitalize">{profile.rgbConfig.mode}</span>
                  </div>
                </div>

                {isActive && (
                  <div className="mt-2 text-xs font-bold text-predator-blue uppercase tracking-wider">
                    ● Activo
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {applying && (
        <div className="mt-4 text-center text-yellow-400 animate-pulse">
          ⏳ Aplicando perfil... Puede solicitar contraseña sudo
        </div>
      )}
    </div>
  );
};

export default ProfileSwitcher;
