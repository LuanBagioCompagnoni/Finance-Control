import express from 'express';
import UserController from '../controllers/User.js'

const userController = new UserController()

const router = express.Router();

router.post('/', (req, res, next) => userController.create(req, res, next));

export default router;
