import mongoose, { Document, Schema, Types } from 'mongoose'

export type AccountType = 'checking' | 'savings' | 'investment' | 'credit'

export interface IAccount extends Document {
  userId: Types.ObjectId
  name: string
  bank: string
  type: AccountType
  balance: number
  color: string
  createdAt: Date
}

const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  bank: { type: String, required: true, trim: true },
  type: { type: String, enum: ['checking', 'savings', 'investment', 'credit'], required: true },
  balance: { type: Number, required: true, default: 0 },
  color: { type: String, required: true, default: '#6366f1' },
  createdAt: { type: Date, default: Date.now },
})

export const Account = mongoose.model<IAccount>('Account', AccountSchema)
