import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod'
const JWT_EXPIRES_IN = '7d'
export const COOKIE_NAME = 'auth-token'

export interface JwtPayload {
  userId: string
  email: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET)
  if (typeof decoded !== 'object' || !decoded || !('userId' in decoded) || !('email' in decoded)) {
    throw new Error('INVALID_TOKEN_SHAPE')
  }
  return decoded as JwtPayload
}
