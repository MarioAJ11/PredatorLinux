import { Provider } from 'react-redux';
import { store } from './store';
import { useElectronListeners } from './hooks/useElectronListeners';
import Dashboard from './components/Dashboard';
import './index.css';

function AppContent() {
  // Conectar listeners de Electron con Redux
  useElectronListeners();

  return (
    <div className="min-h-screen bg-predator-dark">
      <Dashboard />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
