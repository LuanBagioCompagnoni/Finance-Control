import { User, IUser } from '../models/User'
import { hashPassword, comparePassword } from '../helpers/password'
import { signToken } from '../helpers/jwt'
import { CategoryService } from './CategoryService'
import mongoose, { Types } from 'mongoose'

export class AuthService {
  static async register(name: string, email: string, password: string): Promise<{ user: IUser; token: string }> {
    const existing = await User.findOne({ email })
    if (existing) throw new Error('EMAIL_IN_USE')

    const passwordHash = await hashPassword(password)

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const [user] = await User.create([{ name, email, passwordHash }], { session })
      await CategoryService.seedDefaultCategories(user._id as Types.ObjectId, session)
      await session.commitTransaction()
      const token = signToken({ userId: String(user._id), email: user.email })
      return { user, token }
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
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
