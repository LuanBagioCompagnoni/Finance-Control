import mongoose, { Types } from 'mongoose'
import { InstallmentGroup, IInstallmentGroup } from '../models/InstallmentGroup'
import { Transaction } from '../models/Transaction'
import { Account } from '../models/Account'

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

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const [group] = await InstallmentGroup.create([{
        userId,
        creditCardAccountId: new Types.ObjectId(data.creditCardAccountId),
        description: data.description,
        totalAmount: data.totalAmount,
        installmentCount: data.installmentCount,
        installmentAmount,
        startDate: data.startDate,
      }], { session })

      const startDate = new Date(data.startDate)
      const transactions = Array.from({ length: data.installmentCount }, (_, i) => {
        const date = new Date(Date.UTC(
          startDate.getUTCFullYear(),
          startDate.getUTCMonth() + i,
          startDate.getUTCDate(),
          12, 0, 0, 0,
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

      await Transaction.insertMany(transactions, { session })

      // Each installment is EXPENSE: decrement account balance by total
      const account = await Account.findOneAndUpdate(
        { _id: data.creditCardAccountId, userId },
        { $inc: { balance: -(installmentAmount * data.installmentCount) } },
        { session }
      )
      if (!account) throw new Error('ACCOUNT_NOT_FOUND')

      await session.commitTransaction()
      return { group, transactionsCreated: data.installmentCount }
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  static async findAll(userId: Types.ObjectId): Promise<IInstallmentGroup[]> {
    return InstallmentGroup.find({ userId }).sort({ startDate: -1 })
  }

  static async delete(userId: Types.ObjectId, id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const group = await InstallmentGroup.findOneAndDelete({ _id: id, userId }, { session })
      if (!group) {
        await session.abortTransaction()
        return false
      }

      // Restore the balance: reverse the total amount debited when group was created
      const totalDebited = group.installmentAmount * group.installmentCount
      await Account.findByIdAndUpdate(
        group.creditCardAccountId,
        { $inc: { balance: totalDebited } },
        { session }
      )

      await Transaction.deleteMany({ installmentGroupId: id }, { session })

      await session.commitTransaction()
      return true
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }
}
