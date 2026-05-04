import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
    })
    return
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
