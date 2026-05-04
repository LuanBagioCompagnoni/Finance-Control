import { Router } from 'express'
import { z, ZodError } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { InstallmentService } from '../services/InstallmentService'
import { Types } from 'mongoose'

const router = Router()
router.use(authenticate)

const createSchema = z.object({
  creditCardAccountId: z.string(),
  categoryId: z.string(),
  description: z.string().min(1),
  totalAmount: z.number().positive(),
  installmentCount: z.number().int().min(2).max(60),
  startDate: z.coerce.date(),
})

router.get('/', async (req, res, next) => {
  try {
    const groups = await InstallmentService.findAll(new Types.ObjectId(req.user!.userId))
    res.json(groups)
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body)
    const result = await InstallmentService.create(new Types.ObjectId(req.user!.userId), data)
    res.status(201).json(result)
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation error', details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })) })
      return
    }
    if (err instanceof Error && err.message === 'ACCOUNT_NOT_FOUND') {
      res.status(404).json({ error: 'Account not found' })
      return
    }
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const ok = await InstallmentService.delete(new Types.ObjectId(req.user!.userId), req.params.id)
    if (!ok) { res.status(404).json({ error: 'Installment group not found' }); return }
    res.json({ message: 'Deleted' })
  } catch (err) { next(err) }
})

export { router as installmentsRouter }
