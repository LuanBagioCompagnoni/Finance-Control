import { Types } from 'mongoose'
import { InvestmentEntry, IInvestmentEntry, InvestmentType } from '../models/InvestmentEntry'

export class InvestmentService {
  static async findAll(userId: Types.ObjectId, type?: InvestmentType): Promise<IInvestmentEntry[]> {
    const filter: { userId: Types.ObjectId; type?: InvestmentType } = { userId }
    if (type) filter.type = type
    return InvestmentEntry.find(filter)
      .populate('accountId', 'name color')
      .sort({ date: -1 })
  }

  static async create(userId: Types.ObjectId, data: {
    accountId: string
    date: Date
    amount: number
    type: InvestmentType
    assetName: string
    description?: string
  }): Promise<IInvestmentEntry> {
    return InvestmentEntry.create({
      ...data,
      userId,
      accountId: new Types.ObjectId(data.accountId),
    })
  }

  static async delete(userId: Types.ObjectId, id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false
    const result = await InvestmentEntry.findOneAndDelete({ _id: id, userId })
    return result !== null
  }
}
