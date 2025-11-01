import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { FanService } from '@/services/fan-service';
import type { ApiResponse } from '@/types/System.types';

// Esquema de validación para control de ventiladores
const setFanSpeedSchema = z.object({
  fan: z.enum(['cpu', 'gpu'], {
    required_error: "El campo 'fan' es requerido. Valores permitidos: 'cpu' o 'gpu'",
  }),
  speed: z.number({
    required_error: "El campo 'speed' es requerido",
  }).min(0, 'La velocidad mínima es 0')
    .max(100, 'La velocidad máxima es 100')
});

/**
 * Controlador para gestionar los ventiladores
 */
export class FanController {
  private fanService: FanService;

  constructor() {
    this.fanService = new FanService();
  }

  /**
   * Establece la velocidad de un ventilador
   * POST /api/fans/speed
   * Body: { fan: 'cpu' | 'gpu', speed: number }
   */
  setFanSpeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = setFanSpeedSchema.parse(req.body);
      
      await this.fanService.setFanSpeed(validatedData.fan, validatedData.speed);
      
      const response: ApiResponse = {
        success: true,
        message: `Ventilador ${validatedData.fan} establecido a ${validatedData.speed}%`
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Activa el modo automático de ventiladores
   * POST /api/fans/auto
   */
  setAutoMode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.fanService.setAutoMode();
      
      const response: ApiResponse = {
        success: true,
        message: 'Modo automático de ventiladores activado'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
