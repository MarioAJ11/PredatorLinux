import { Request, Response, NextFunction } from 'express';
import { SystemStatsService } from '@/services/system-stats-service';
import type { ApiResponse, SystemStats } from '@/types/System.types';

/**
 * Controlador para gestionar las estadísticas del sistema
 */
export class SystemStatsController {
  private systemStatsService: SystemStatsService;

  constructor() {
    this.systemStatsService = new SystemStatsService();
  }

  /**
   * Obtiene las estadísticas actuales del sistema
   * GET /api/stats
   */
  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.systemStatsService.getSystemStats();
      
      const response: ApiResponse<SystemStats> = {
        success: true,
        data: stats
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
