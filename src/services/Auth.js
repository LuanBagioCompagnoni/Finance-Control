import passport from 'passport';

export default class AuthService {

    login(req, res, next) {
        return new Promise((resolve, reject) => {
            passport.authenticate('local', (err, user, info) => {
                if (err) return reject({ success: false, err });
                if (!user) return resolve({ success: false, err });

                req.logIn(user, (err) => {
                    if (err) return reject({ success: false, err });

                    resolve({ success: true, message: 'Login bem-sucedido', user: { id: user.id, email: user.email } });
                });
            })(req, res, next);
        });
    }
}
