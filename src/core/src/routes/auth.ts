import { Router } from 'express'
import { z, ZodError } from 'zod'
import { AuthService } from '../services/AuthService'
import { authenticate } from '../middleware/authenticate'
import { COOKIE_NAME } from '../helpers/jwt'

const router = Router()

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)
    const { user, token } = await AuthService.register(name, email, password)
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation error', details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })) })
      return
    }
    if (err instanceof Error && err.message === 'EMAIL_IN_USE') {
      res.status(409).json({ error: 'Email already in use' })
      return
    }
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const { user, token } = await AuthService.login(email, password)
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation error', details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })) })
      return
    }
    if (err instanceof Error && err.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }
    next(err)
  }
})

router.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME)
  res.status(200).json({ message: 'Logged out' })
})

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await AuthService.findById(req.user!.userId)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ id: user._id, name: user.name, email: user.email })
  } catch (err) {
    next(err)
  }
})

export { router as authRouter }
