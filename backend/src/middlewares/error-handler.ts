import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ApiResponse } from '@/types/System.types';

/**
 * Middleware global de manejo de errores
 * Debe ser el último middleware registrado en la aplicación
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error en petición', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // Error de validación de Zod
  if (err instanceof ZodError) {
    const response: ApiResponse = {
      success: false,
      message: 'Error de validación',
      errors: err.errors.map((error) => ({
        field: error.path.join('.'),
        message: error.message
      }))
    };
    res.status(400).json(response);
    return;
  }

  // Error de ejecución de comandos shell
  if (err.message.startsWith('ShellError:')) {
    const response: ApiResponse = {
      success: false,
      message: 'Error al ejecutar comando en el servidor'
    };
    res.status(500).json(response);
    return;
  }

  // Error genérico
  const response: ApiResponse = {
    success: false,
    message: 'Error interno del servidor'
  };
  res.status(500).json(response);
};
