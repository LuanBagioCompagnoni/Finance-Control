import express from 'express';
import AuthController from '../controllers/Auth.js'

const authController = new AuthController()

const router = express.Router();

router.post('/login', (req, res, next) => authController.login(req, res, next));
export default router;
