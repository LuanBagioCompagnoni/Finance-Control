import { Account, IAccount } from '../models/Account'
import { Transaction } from '../models/Transaction'
import { Types } from 'mongoose'

export class AccountService {
  static async findAll(userId: Types.ObjectId): Promise<IAccount[]> {
    return Account.find({ userId }).sort({ createdAt: 1 })
  }

  static async create(userId: Types.ObjectId, data: {
    name: string
    bank: string
    type: 'checking' | 'savings' | 'investment' | 'credit'
    color: string
    initialBalance: number
  }): Promise<IAccount> {
    return Account.create({ ...data, userId, balance: data.initialBalance })
  }

  static async update(userId: Types.ObjectId, id: string, data: Partial<{
    name: string
    bank: string
    color: string
  }>): Promise<IAccount | null> {
    return Account.findOneAndUpdate({ _id: id, userId }, data, { new: true })
  }

  static async delete(userId: Types.ObjectId, id: string): Promise<{ ok: boolean; error?: string }> {
    const txCount = await Transaction.countDocuments({ $or: [{ accountId: id }, { toAccountId: id }] })
    if (txCount > 0) return { ok: false, error: 'Account has transactions' }
    await Account.findOneAndDelete({ _id: id, userId })
    return { ok: true }
  }
}
