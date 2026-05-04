import mongoose, { Document, Schema, Types } from 'mongoose'

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'INVESTMENT'

export interface ITransaction extends Document {
  userId: Types.ObjectId
  accountId: Types.ObjectId
  categoryId: Types.ObjectId
  date: Date
  amount: number
  type: TransactionType
  description: string
  toAccountId?: Types.ObjectId
  installmentGroupId?: Types.ObjectId
  installmentIndex?: number
  createdAt: Date
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['INCOME', 'EXPENSE', 'TRANSFER', 'INVESTMENT'], required: true },
  description: { type: String, required: true, trim: true },
  toAccountId: { type: Schema.Types.ObjectId, ref: 'Account' },
  installmentGroupId: { type: Schema.Types.ObjectId, ref: 'InstallmentGroup' },
  installmentIndex: { type: Number },
  createdAt: { type: Date, default: Date.now },
})

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema)
