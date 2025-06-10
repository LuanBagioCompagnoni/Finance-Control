import UserService from '../services/User.js'

export default class UserController {

    constructor() {
        this.userService = new UserService();
    }

    async create (req, res) {
        try {
            const body = req.body;

            const result = await this.userService.create(body, req);

            if (result?.success !== true) {
                return res.status(400).json(result)
            }

            return res.status(200).json(result)
        } catch (err) {
            console.log(err)
            res.status(500).json({ success: false, message: 'Internal server error!', error: err})
        }
    }
}
