import { Router } from 'express';
import { SystemStatsController } from '@/controllers/system-stats-controller';

const router = Router();
const systemStatsController = new SystemStatsController();

/**
 * GET /api/stats
 * Obtiene las estadísticas actuales del sistema
 */
router.get('/', systemStatsController.getStats);

export default router;
