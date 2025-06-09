import authRoutes from './auth.js';
import userRoutes from './user.js';

const routes = (app) => {
    app.use('/auth', authRoutes);
    app.use('/user', userRoutes);
    app.use('/', (req, res) => {
        res.json({ message: 'Welcome!'})
    })
};

export default routes;
