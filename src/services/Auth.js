import passport from 'passport';

export default class AuthService {

    login(req, res, next) {
        return new Promise((resolve, reject) => {
            passport.authenticate('local', (err, user, info) => {
                if (err) return reject({ error: err.message });
                if (!user) return resolve({ error: info.message });

                req.logIn(user, (err) => {
                    if (err) return reject({ error: err.message });

                    resolve({ message: 'Login bem-sucedido', user: { id: user.id, email: user.email } });
                });
            })(req, res, next);
        });
    }
}
