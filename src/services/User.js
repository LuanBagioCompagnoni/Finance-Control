import UserModel from '../models/user.js'
import {generateSalt, hashPassword} from "../helpers/password.js";

export default class UserService {
    async create(user) {
        try {
            const salt = generateSalt()

            const userInsertObject = {
                name: user.name,
                email: user.email,
                passwordData: {
                    password: await hashPassword(user.password, salt),
                    salt
                }
            }

            return await UserModel.insertOne(userInsertObject);
        } catch (err) {
            console.log(err)

            if (err.code === 11000) {
                return { success: false, message: 'User already exists!' }
            }

            return { success: false, message: 'Error on creating user!', error: err}
        }
    }
}
