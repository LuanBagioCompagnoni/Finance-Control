import authRoutes from './auth.js';

const routes = (app) => {
    app.use('/auth', authRoutes);
    app.use('/', (req, res) => {
        res.json({ message: 'Welcome!'})
    })
};

export default routes;
