import { Router } from 'express'
import { z, ZodError } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { AccountService } from '../services/AccountService'
import { Types } from 'mongoose'

const router = Router()
router.use(authenticate)

const createSchema = z.object({
  name: z.string().min(1),
  bank: z.string().min(1),
  type: z.enum(['checking', 'savings', 'investment', 'credit']),
  color: z.string().default('#6366f1'),
  initialBalance: z.number().default(0),
})

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  bank: z.string().min(1).optional(),
  color: z.string().optional(),
})

router.get('/', async (req, res, next) => {
  try {
    const accounts = await AccountService.findAll(new Types.ObjectId(req.user!.userId))
    res.json(accounts)
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body)
    const account = await AccountService.create(new Types.ObjectId(req.user!.userId), data)
    res.status(201).json(account)
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation error', details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })) })
      return
    }
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body)
    const account = await AccountService.update(new Types.ObjectId(req.user!.userId), req.params.id, data)
    if (!account) { res.status(404).json({ error: 'Account not found' }); return }
    res.json(account)
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation error', details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })) })
      return
    }
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await AccountService.delete(new Types.ObjectId(req.user!.userId), req.params.id)
    if (!result.ok) {
      const status = result.error === 'Account not found' ? 404 : 409
      res.status(status).json({ error: result.error })
      return
    }
    res.json({ message: 'Deleted' })
  } catch (err) { next(err) }
})

export { router as accountsRouter }
