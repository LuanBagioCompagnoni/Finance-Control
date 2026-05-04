import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { router } from './routes/index'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors({
  origin: process.env.WEB_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api', router)
app.use(errorHandler)

async function start() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-control')
  console.log('MongoDB connected')
  const port = process.env.PORT || 5000
  app.listen(port, () => console.log(`Core API running on :${port}`))
}

if (process.env.NODE_ENV !== 'test') {
  start().catch(console.error)
}

export { app }
