import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { DashboardService } from '../services/DashboardService'
import { Types } from 'mongoose'

const router = Router()
router.use(authenticate)

router.get('/', async (req, res, next) => {
  try {
    const summary = await DashboardService.getSummary(new Types.ObjectId(req.user!.userId))
    res.json(summary)
  } catch (err) { next(err) }
})

export { router as dashboardRouter }
