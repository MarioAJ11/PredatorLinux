import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ProfileService } from '@/services/profile-service';
import type { ApiResponse } from '@/types/System.types';

// Esquema de validación para el endpoint de turbo mode
const setTurboSchema = z.object({
  enable: z.boolean({
    required_error: "El campo 'enable' es requerido",
  })
});

// Esquema de validación para el endpoint de performance mode
const setPerformanceModeSchema = z.object({
  mode: z.enum(['turbo', 'quiet', 'balanced', 'performance'], {
    required_error: "El campo 'mode' es requerido",
  })
});

/**
 * Controlador para gestionar los perfiles de rendimiento
 */
export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  /**
   * Activa o desactiva el modo Turbo
   * POST /api/profiles/turbo
   * Body: { enable: boolean }
   */
  setTurboMode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar datos de entrada
      const validatedData = setTurboSchema.parse(req.body);
      
      // Ejecutar el comando
      await this.profileService.setTurboMode(validatedData.enable);
      
      // Respuesta exitosa
      const response: ApiResponse = {
        success: true,
        message: `Modo Turbo ${validatedData.enable ? 'activado' : 'desactivado'} correctamente`
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Establece un perfil de rendimiento completo
   * POST /api/profiles/mode
   * Body: { mode: 'turbo' | 'quiet' | 'balanced' | 'performance' }
   */
  setPerformanceMode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = setPerformanceModeSchema.parse(req.body);
      
      await this.profileService.setPerformanceMode(validatedData.mode);
      
      const response: ApiResponse = {
        success: true,
        message: `Perfil de rendimiento '${validatedData.mode}' aplicado correctamente`
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
