import UserModel from '../models/user.js'
import bcrypt
    from "bcrypt";

export default class UserService {
    constructor() {
        this.saltRounds = 10
    }

    async create(body) {
        try {
            const password = body.password
            body.password = await bcrypt.hash(password, this.saltRounds)

            const newUser = await UserModel.insertOne(body)

            console.log(newUser);
            return { sucess: true, message: 'User created sucessfully!'}

        } catch (err) {
            console.log(err)

            if (err.code === 11000) {
                return { sucess: false, message: 'User already exists!' }
            }

            return { sucess: false, message: 'Error on creating user!', error: err}
        }
    }
}
