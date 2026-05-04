import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IInstallmentGroup extends Document {
  userId: Types.ObjectId
  creditCardAccountId: Types.ObjectId
  description: string
  totalAmount: number
  installmentCount: number
  installmentAmount: number
  startDate: Date
  createdAt: Date
}

const InstallmentGroupSchema = new Schema<IInstallmentGroup>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  creditCardAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  description: { type: String, required: true, trim: true },
  totalAmount: { type: Number, required: true, min: 0 },
  installmentCount: { type: Number, required: true, min: 1 },
  installmentAmount: { type: Number, required: true, min: 0 },
  startDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const InstallmentGroup = mongoose.model<IInstallmentGroup>('InstallmentGroup', InstallmentGroupSchema)
