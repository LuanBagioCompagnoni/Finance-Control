import { Category, ICategory } from '../models/Category'
import { Types } from 'mongoose'

const DEFAULT_CATEGORIES = [
  { name: 'Educação', type: 'EXPENSE' as const, costType: 'FIXED' as const, color: '#8b5cf6', icon: 'graduation-cap' },
  { name: 'Seguro', type: 'EXPENSE' as const, costType: 'FIXED' as const, color: '#ef4444', icon: 'shield' },
  { name: 'Moradia', type: 'EXPENSE' as const, costType: 'FIXED' as const, color: '#f97316', icon: 'home' },
  { name: 'Transporte', type: 'EXPENSE' as const, costType: 'VARIABLE' as const, color: '#3b82f6', icon: 'car' },
  { name: 'Alimentação', type: 'EXPENSE' as const, costType: 'VARIABLE' as const, color: '#22c55e', icon: 'shopping-cart' },
  { name: 'Saúde', type: 'EXPENSE' as const, costType: 'VARIABLE' as const, color: '#ec4899', icon: 'heart' },
  { name: 'Lazer', type: 'EXPENSE' as const, costType: 'VARIABLE' as const, color: '#eab308', icon: 'smile' },
  { name: 'Vestuário', type: 'EXPENSE' as const, costType: 'VARIABLE' as const, color: '#a855f7', icon: 'shirt' },
  { name: 'Outros', type: 'EXPENSE' as const, costType: 'VARIABLE' as const, color: '#6b7280', icon: 'more-horizontal' },
  { name: 'Salário', type: 'INCOME' as const, costType: 'FIXED' as const, color: '#10b981', icon: 'trending-up' },
  { name: 'Outros Ganhos', type: 'INCOME' as const, costType: 'VARIABLE' as const, color: '#14b8a6', icon: 'plus-circle' },
  { name: 'Investimento', type: 'INVESTMENT' as const, costType: 'VARIABLE' as const, color: '#0ea5e9', icon: 'bar-chart-2' },
]

export class CategoryService {
  static async seedDefaultCategories(userId: Types.ObjectId): Promise<void> {
    const categories = DEFAULT_CATEGORIES.map(c => ({ ...c, userId }))
    await Category.insertMany(categories)
  }

  static async findAll(userId: Types.ObjectId, type?: string): Promise<ICategory[]> {
    const filter: { userId: Types.ObjectId; type?: string } = { userId }
    if (type) filter.type = type
    return Category.find(filter).sort({ type: 1, name: 1 })
  }

  static async create(userId: Types.ObjectId, data: {
    name: string
    type: 'INCOME' | 'EXPENSE' | 'INVESTMENT'
    costType: 'FIXED' | 'VARIABLE'
    color: string
    icon: string
    monthlyLimit?: number
  }): Promise<ICategory> {
    return Category.create({ ...data, userId })
  }

  static async update(userId: Types.ObjectId, id: string, data: Partial<{
    name: string; type: string; costType: string; color: string; icon: string; monthlyLimit: number
  }>): Promise<ICategory | null> {
    return Category.findOneAndUpdate({ _id: id, userId }, data, { new: true })
  }

  static async delete(userId: Types.ObjectId, id: string): Promise<boolean> {
    const result = await Category.findOneAndDelete({ _id: id, userId })
    return result !== null
  }
}
