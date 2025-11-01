import { Router } from 'express';
import { FanController } from '@/controllers/fan-controller';

const router = Router();
const fanController = new FanController();

/**
 * POST /api/fans/speed
 * Establece la velocidad de un ventilador
 * Body: { fan: 'cpu' | 'gpu', speed: number }
 */
router.post('/speed', fanController.setFanSpeed);

/**
 * POST /api/fans/auto
 * Activa el modo automático de ventiladores
 */
router.post('/auto', fanController.setAutoMode);

export default router;
