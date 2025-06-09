import AuthService from '../services/Auth.js';

export default class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async login(req, res, next) {
        try {
            const result = await this.authService.login(req, res, next);

            if (result.sucess !== true) {
                return res.status(400).json(result);
            }

            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({ sucess: false, message: 'Internal server error', error: err });
        }
    }
}
