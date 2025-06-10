import express from 'express';
import AuthController from '../controllers/Auth.js'

const authController = new AuthController()

const router = express.Router();

router.post('/sign-in', (req, res, next) => authController.signIn(req, res, next));
router.post('/sign-up', (req, res, next) => authController.signUp(req, res, next));

export default router;
