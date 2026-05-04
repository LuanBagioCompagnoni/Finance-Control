import mongoose, { Document, Schema, Types } from 'mongoose'

export type InvestmentType = 'ETF' | 'ACAO' | 'CDB' | 'TESOURO' | 'FII' | 'RENDA_FIXA' | 'CRIPTO' | 'OUTRO'

export interface IInvestmentEntry extends Document {
  userId: Types.ObjectId
  accountId: Types.ObjectId
  date: Date
  amount: number
  type: InvestmentType
  assetName: string
  description?: string
  createdAt: Date
}

const InvestmentEntrySchema = new Schema<IInvestmentEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['ETF', 'ACAO', 'CDB', 'TESOURO', 'FII', 'RENDA_FIXA', 'CRIPTO', 'OUTRO'], required: true },
  assetName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
})

export const InvestmentEntry = mongoose.model<IInvestmentEntry>('InvestmentEntry', InvestmentEntrySchema)
