import { Router } from 'express';
import { ProfileController } from '@/controllers/profile-controller';

const router = Router();
const profileController = new ProfileController();

/**
 * POST /api/profiles/turbo
 * Activa o desactiva el modo Turbo
 * Body: { enable: boolean }
 */
router.post('/turbo', profileController.setTurboMode);

/**
 * POST /api/profiles/mode
 * Establece un perfil de rendimiento completo
 * Body: { mode: 'turbo' | 'quiet' | 'balanced' | 'performance' }
 */
router.post('/mode', profileController.setPerformanceMode);

export default router;
