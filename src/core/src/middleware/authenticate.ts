import { Request, Response, NextFunction } from 'express'
import { verifyToken, COOKIE_NAME, JwtPayload } from '../helpers/jwt'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies[COOKIE_NAME]
  if (!token) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
