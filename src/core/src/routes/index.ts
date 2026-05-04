import { Router } from 'express'
import { authRouter } from './auth'
import { accountsRouter } from './accounts'
import { categoriesRouter } from './categories'
import { transactionsRouter } from './transactions'
import { installmentsRouter } from './installments'
import { investmentsRouter } from './investments'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/auth', authRouter)
router.use('/accounts', accountsRouter)
router.use('/categories', categoriesRouter)
router.use('/transactions', transactionsRouter)
router.use('/installments', installmentsRouter)
router.use('/investments', investmentsRouter)

export { router }
