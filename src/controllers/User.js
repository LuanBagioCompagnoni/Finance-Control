import UserService from '../services/User.js'

export default class UserController {

    constructor() {
        this.userService = new UserService();
    }

    async create (req, res) {
        try {
            const body = req.body;

            const newUser = await this.userService.create(body, req);

            if (newUser?.success !== true) {

                return res.status(400).json(newUser)
            }

            await new Promise((resolve, reject) => {
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

            return res.status(200).json(newUser)
        } catch (err) {
            console.log(err)
            res.status(500).json({ success: false, message: 'Internal server error!', error: err})
        }
    }
}
