import { Router } from 'express'
import { z, ZodError } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { InvestmentService } from '../services/InvestmentService'
import { InvestmentType } from '../models/InvestmentEntry'
import { Types } from 'mongoose'

const router = Router()
router.use(authenticate)

const VALID_INVESTMENT_TYPES: InvestmentType[] = ['ETF', 'ACAO', 'CDB', 'TESOURO', 'FII', 'RENDA_FIXA', 'CRIPTO', 'OUTRO']

const createSchema = z.object({
  accountId: z.string().min(1),
  date: z.coerce.date(),
  amount: z.number().positive(),
  type: z.enum(['ETF', 'ACAO', 'CDB', 'TESOURO', 'FII', 'RENDA_FIXA', 'CRIPTO', 'OUTRO']),
  assetName: z.string().min(1),
  description: z.string().optional(),
})

router.get('/', async (req, res, next) => {
  try {
    const rawType = req.query.type as string | undefined
    const type: InvestmentType | undefined = VALID_INVESTMENT_TYPES.includes(rawType as InvestmentType)
      ? (rawType as InvestmentType)
      : undefined
    const entries = await InvestmentService.findAll(new Types.ObjectId(req.user!.userId), type)
    res.json(entries)
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body)
    const entry = await InvestmentService.create(new Types.ObjectId(req.user!.userId), data)
    res.status(201).json(entry)
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
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ error: 'Investment not found' })
      return
    }
    const ok = await InvestmentService.delete(new Types.ObjectId(req.user!.userId), req.params.id)
    if (!ok) { res.status(404).json({ error: 'Investment not found' }); return }
    res.json({ message: 'Deleted' })
  } catch (err) { next(err) }
})

export { router as investmentsRouter }
