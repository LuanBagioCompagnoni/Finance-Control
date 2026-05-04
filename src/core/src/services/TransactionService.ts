import mongoose, { Types } from 'mongoose'
import { Transaction, ITransaction } from '../models/Transaction'
import { Account } from '../models/Account'

type CreateTransactionData = {
  accountId: string
  categoryId: string
  date: Date
  amount: number
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'INVESTMENT'
  description: string
  toAccountId?: string
}

export class TransactionService {
  static async create(userId: Types.ObjectId, data: CreateTransactionData): Promise<ITransaction> {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const [tx] = await Transaction.create([{
        ...data,
        userId,
        accountId: new Types.ObjectId(data.accountId),
        categoryId: new Types.ObjectId(data.categoryId),
        toAccountId: data.toAccountId ? new Types.ObjectId(data.toAccountId) : undefined,
      }], { session })

      if (data.type === 'EXPENSE' || data.type === 'INVESTMENT') {
        await Account.findByIdAndUpdate(data.accountId, { $inc: { balance: -data.amount } }, { session })
      } else if (data.type === 'INCOME') {
        await Account.findByIdAndUpdate(data.accountId, { $inc: { balance: data.amount } }, { session })
      } else if (data.type === 'TRANSFER' && data.toAccountId) {
        await Account.findByIdAndUpdate(data.accountId, { $inc: { balance: -data.amount } }, { session })
        await Account.findByIdAndUpdate(data.toAccountId, { $inc: { balance: data.amount } }, { session })
      }

      await session.commitTransaction()
      return tx
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  static async delete(userId: Types.ObjectId, id: string): Promise<boolean> {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const tx = await Transaction.findOne({ _id: id, userId })
      if (!tx) { await session.abortTransaction(); return false }

      if (tx.type === 'EXPENSE' || tx.type === 'INVESTMENT') {
        await Account.findByIdAndUpdate(tx.accountId, { $inc: { balance: tx.amount } }, { session })
      } else if (tx.type === 'INCOME') {
        await Account.findByIdAndUpdate(tx.accountId, { $inc: { balance: -tx.amount } }, { session })
      } else if (tx.type === 'TRANSFER' && tx.toAccountId) {
        await Account.findByIdAndUpdate(tx.accountId, { $inc: { balance: tx.amount } }, { session })
        await Account.findByIdAndUpdate(tx.toAccountId, { $inc: { balance: -tx.amount } }, { session })
      }

      await Transaction.findByIdAndDelete(id, { session })
      await session.commitTransaction()
      return true
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  static async findAll(userId: Types.ObjectId, filters: {
    startDate?: Date
    endDate?: Date
    accountId?: string
    categoryId?: string
    type?: string
    page?: number
    limit?: number
  }): Promise<{ data: ITransaction[]; total: number }> {
    const query: Record<string, unknown> = { userId }

    if (filters.startDate || filters.endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {}
      if (filters.startDate) dateFilter.$gte = filters.startDate
      if (filters.endDate) dateFilter.$lte = filters.endDate
      query.date = dateFilter
    }
    if (filters.accountId) query.accountId = new Types.ObjectId(filters.accountId)
    if (filters.categoryId) query.categoryId = new Types.ObjectId(filters.categoryId)
    if (filters.type) query.type = filters.type

    const page = filters.page || 1
    const limit = filters.limit || 50
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      Transaction.find(query)
        .populate('categoryId', 'name color')
        .populate('accountId', 'name color')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(query),
    ])

    return { data, total }
  }
}
