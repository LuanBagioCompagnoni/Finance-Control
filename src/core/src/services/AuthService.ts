import { User, IUser } from '../models/User'
import { hashPassword, comparePassword } from '../helpers/password'
import { signToken } from '../helpers/jwt'
import { CategoryService } from './CategoryService'
import { Types } from 'mongoose'

export class AuthService {
  static async register(name: string, email: string, password: string): Promise<{ user: IUser; token: string }> {
    const existing = await User.findOne({ email })
    if (existing) throw new Error('EMAIL_IN_USE')

    const passwordHash = await hashPassword(password)
    const user = await User.create({ name, email, passwordHash })

    await CategoryService.seedDefaultCategories(user._id as Types.ObjectId)

    const token = signToken({ userId: String(user._id), email: user.email })
    return { user, token }
  }

  static async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email })
    if (!user) throw new Error('INVALID_CREDENTIALS')

    const valid = await comparePassword(password, user.passwordHash)
    if (!valid) throw new Error('INVALID_CREDENTIALS')

    const token = signToken({ userId: String(user._id), email: user.email })
    return { user, token }
  }

  static async findById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-passwordHash')
  }
}
