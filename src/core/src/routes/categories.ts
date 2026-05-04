import { Router } from 'express'
import { z, ZodError } from 'zod'
import { authenticate } from '../middleware/authenticate'
import { CategoryService } from '../services/CategoryService'
import { Types } from 'mongoose'

const router = Router()
router.use(authenticate)

const createSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
  costType: z.enum(['FIXED', 'VARIABLE']),
  color: z.string().default('#6366f1'),
  icon: z.string().default('circle'),
  monthlyLimit: z.number().positive().optional(),
})

const updateSchema = createSchema.partial()

router.get('/', async (req, res, next) => {
  try {
    const type = req.query.type as string | undefined
    const categories = await CategoryService.findAll(new Types.ObjectId(req.user!.userId), type as any)
    res.json(categories)
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body)
    const category = await CategoryService.create(new Types.ObjectId(req.user!.userId), data)
    res.status(201).json(category)
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
    const category = await CategoryService.update(new Types.ObjectId(req.user!.userId), req.params.id, data)
    if (!category) { res.status(404).json({ error: 'Category not found' }); return }
    res.json(category)
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
    const ok = await CategoryService.delete(new Types.ObjectId(req.user!.userId), req.params.id)
    if (!ok) { res.status(404).json({ error: 'Category not found' }); return }
    res.json({ message: 'Deleted' })
  } catch (err) { next(err) }
})

export { router as categoriesRouter }
