import AuthService from '../services/Auth.js';
import UserService from "../services/User.js";

export default class AuthController {
    constructor() {
        this.authService = new AuthService();
        this.userService = new UserService();
    }

    async signIn(req, res, next) {
        try {
            const result = await this.authService.login(req, res, next);

            if (result.success !== true) {
                return res.status(400).json(result);
            }

            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Internal server error', error: err });
        }
    }

    async signUp(req, res) {
        try {
            const result = await this.userService.create(req.body, req);

            if (result.success !== true) {
                return res.status(400).json(result);
            }

            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Internal server error', error: err });

        }
    }
}
