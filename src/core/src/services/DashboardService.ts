import { Types } from 'mongoose'
import { Account } from '../models/Account'
import { Transaction } from '../models/Transaction'
import { InvestmentEntry } from '../models/InvestmentEntry'

export class DashboardService {
  static async getSummary(userId: Types.ObjectId) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const [accounts, monthlyTransactions, monthlyInvestments] = await Promise.all([
      Account.find({ userId }),
      Transaction.find({ userId, date: { $gte: startOfMonth, $lte: endOfMonth } })
        .populate('categoryId', 'name color'),
      InvestmentEntry.find({ userId, date: { $gte: startOfMonth, $lte: endOfMonth } }),
    ])

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyInvestmentsTotal = monthlyInvestments.reduce((sum, i) => sum + i.amount, 0)

    const expensesByCategory: Record<string, { name: string; color: string; total: number }> = {}
    for (const tx of monthlyTransactions.filter(t => t.type === 'EXPENSE')) {
      const cat = tx.categoryId as unknown as { _id: Types.ObjectId; name: string; color: string }
      const key = String(cat._id)
      if (!expensesByCategory[key]) {
        expensesByCategory[key] = { name: cat.name, color: cat.color, total: 0 }
      }
      expensesByCategory[key].total += tx.amount
    }

    const monthlyHistory = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
        const start = new Date(d.getFullYear(), d.getMonth(), 1)
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
        const label = d.toLocaleString('pt-BR', { month: 'short', year: '2-digit' })
        return Transaction.aggregate([
          { $match: { userId, date: { $gte: start, $lte: end } } },
          { $group: { _id: '$type', total: { $sum: '$amount' } } },
        ]).then(result => {
          const income = result.find(r => r._id === 'INCOME')?.total || 0
          const expense = result.find(r => r._id === 'EXPENSE')?.total || 0
          return { month: label, income, expense }
        })
      })
    )

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      monthlyInvestments: monthlyInvestmentsTotal,
      expensesByCategory: Object.values(expensesByCategory).sort((a, b) => b.total - a.total),
      monthlyHistory,
    }
  }
}
