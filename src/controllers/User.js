import UserService from '../services/User.js'

export default class UserController {

    constructor() {
        this.userService = new UserService();
    }

    async create (req, res) {
        try {
            const body = req.body;

            return this.userService.create(body).then((result) => {
                if (result.sucess !== true) {
                    res.status(400).json(result)
                }

                res.status(200).json(result)
            })
        } catch (err) {
            res.status(500).json({ sucess: false, message: 'Internal server error!', error: err})
        }
    }
}
