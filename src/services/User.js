import UserModel from '../models/user.js'
import { hashPassword, generateSalt } from "../helpers/password.js";

export default class UserService {
    async create(user, req) {
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

            const newUser = await UserModel.insertOne(userInsertObject)

            console.log(newUser);

            return await new Promise((resolve, reject) => {
                req.logIn(newUser, (err) => {
                    if (err) {
                        resolve({ success: false, error: err });
                    } else {
                        resolve({
                            success: true,
                            message: 'User created successfully!',
                            user: {
                                id: newUser._id,
                                email: newUser.email
                            }
                        });
                    }
                });
            });
        } catch (err) {
            console.log(err)

            if (err.code === 11000) {
                return { success: false, message: 'User already exists!' }
            }

            return { success: false, message: 'Error on creating user!', error: err}
        }
    }
}
