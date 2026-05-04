import mongoose, { Document, Schema, Types } from 'mongoose'

export type CategoryType = 'INCOME' | 'EXPENSE' | 'INVESTMENT'
export type CostType = 'FIXED' | 'VARIABLE'

export interface ICategory extends Document {
  userId: Types.ObjectId
  name: string
  type: CategoryType
  costType: CostType
  color: string
  icon: string
  monthlyLimit?: number
  createdAt: Date
}

const CategorySchema = new Schema<ICategory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE', 'INVESTMENT'], required: true },
  costType: { type: String, enum: ['FIXED', 'VARIABLE'], required: true },
  color: { type: String, required: true, default: '#6366f1' },
  icon: { type: String, required: true, default: 'circle' },
  monthlyLimit: { type: Number },
  createdAt: { type: Date, default: Date.now },
})

export const Category = mongoose.model<ICategory>('Category', CategorySchema)
