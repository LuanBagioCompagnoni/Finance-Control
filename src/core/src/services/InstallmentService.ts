import { Types } from 'mongoose'
import { InstallmentGroup, IInstallmentGroup } from '../models/InstallmentGroup'
import { Transaction } from '../models/Transaction'

export class InstallmentService {
  static async create(userId: Types.ObjectId, data: {
    creditCardAccountId: string
    categoryId: string
    description: string
    totalAmount: number
    installmentCount: number
    startDate: Date
  }): Promise<{ group: IInstallmentGroup; transactionsCreated: number }> {
    const installmentAmount = Math.round((data.totalAmount / data.installmentCount) * 100) / 100

    const group = await InstallmentGroup.create({
      userId,
      creditCardAccountId: new Types.ObjectId(data.creditCardAccountId),
      description: data.description,
      totalAmount: data.totalAmount,
      installmentCount: data.installmentCount,
      installmentAmount,
      startDate: data.startDate,
    })

    const transactions = Array.from({ length: data.installmentCount }, (_, i) => {
      const base = new Date(data.startDate)
      const date = new Date(Date.UTC(
        base.getUTCFullYear(),
        base.getUTCMonth() + i,
        base.getUTCDate(),
        12, 0, 0, 0
      ))
      return {
        userId,
        accountId: new Types.ObjectId(data.creditCardAccountId),
        categoryId: new Types.ObjectId(data.categoryId),
        date,
        amount: installmentAmount,
        type: 'EXPENSE' as const,
        description: `${data.description} (${i + 1}/${data.installmentCount})`,
        installmentGroupId: group._id,
        installmentIndex: i + 1,
      }
    })

    await Transaction.insertMany(transactions)

    return { group, transactionsCreated: data.installmentCount }
  }

  static async findAll(userId: Types.ObjectId): Promise<IInstallmentGroup[]> {
    return InstallmentGroup.find({ userId }).sort({ startDate: -1 })
  }

  static async delete(userId: Types.ObjectId, id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false
    const group = await InstallmentGroup.findOneAndDelete({ _id: id, userId })
    if (!group) return false
    await Transaction.deleteMany({ installmentGroupId: id })
    return true
  }
}
