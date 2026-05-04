import { Router } from 'express'
import { z, ZodError } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { TransactionService } from '../services/TransactionService'
import { Types } from 'mongoose'

const router = Router()
router.use(authenticate)

const createSchema = z.object({
  accountId: z.string(),
  categoryId: z.string(),
  date: z.coerce.date(),
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER', 'INVESTMENT']),
  description: z.string().min(1),
  toAccountId: z.string().optional(),
})

router.get('/', async (req, res, next) => {
  try {
    const { startDate, endDate, accountId, categoryId, type, page, limit } = req.query
    const result = await TransactionService.findAll(new Types.ObjectId(req.user!.userId), {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      accountId: accountId as string | undefined,
      categoryId: categoryId as string | undefined,
      type: type as string | undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    })
    res.json(result)
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body)
    const tx = await TransactionService.create(new Types.ObjectId(req.user!.userId), data)
    res.status(201).json(tx)
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
    const ok = await TransactionService.delete(new Types.ObjectId(req.user!.userId), req.params.id)
    if (!ok) { res.status(404).json({ error: 'Transaction not found' }); return }
    res.json({ message: 'Deleted' })
  } catch (err) { next(err) }
})

export { router as transactionsRouter }
