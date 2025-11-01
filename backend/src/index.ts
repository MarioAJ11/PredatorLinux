import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { SERVER_PORT } from '@/utils/constants';
import { errorHandler } from '@/middlewares/error-handler';
import profileRoutes from '@/routes/profile-routes';
import statsRoutes from '@/routes/stats-routes';
import fanRoutes from '@/routes/fan-routes';

/**
 * Aplicación Express principal
 */
const app: Express = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'PredatorLinux Backend API está funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/profiles', profileRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/fans', fanRoutes);

// Middleware de manejo de errores (debe ser el último)
app.use(errorHandler);

// Iniciar servidor
app.listen(SERVER_PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${SERVER_PORT}`);
  console.log(`📊 Health check: http://localhost:${SERVER_PORT}/health`);
});

export default app;
