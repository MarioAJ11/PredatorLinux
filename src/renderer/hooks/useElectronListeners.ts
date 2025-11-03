import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setStats } from '../store/statsSlice';
import { setGuardianWarning, addNotification } from '../store/uiSlice';

/**
 * Hook que activa los listeners de Electron y actualiza el store de Redux
 * Debe ser llamado una vez en el componente principal de la app
 */
export const useElectronListeners = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Listener de estadísticas del sistema
    const unsubscribeStats = window.electronAPI.onStatsUpdate((stats) => {
      dispatch(setStats(stats));
    });

    // Listener del Guardián de Seguridad
    const unsubscribeGuardian = window.electronAPI.onGuardianEvent((message) => {
      dispatch(setGuardianWarning(message));
      
      // Agregar notificación
      const isWarning = message.includes('⚠️') || message.includes('CRÍTICA');
      dispatch(addNotification({
        message,
        type: isWarning ? 'warning' : 'info',
      }));

      // Auto-limpiar warning después de 10 segundos si no es crítico
      if (!isWarning) {
        setTimeout(() => {
          dispatch(setGuardianWarning(null));
        }, 10000);
      }
    });

    // Cleanup
    return () => {
      unsubscribeStats();
      unsubscribeGuardian();
    };
  }, [dispatch]);
};
