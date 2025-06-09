import passport from 'passport';

export default class AuthService {

    login(req, res, next) {
        return new Promise((resolve, reject) => {
            passport.authenticate('local', (err, user, info) => {
                if (err) return reject({ sucess: false, err });
                if (!user) return resolve({ sucess: false, err });

                req.logIn(user, (err) => {
                    if (err) return reject({ sucess: false, err });

                    resolve({ sucess: true, message: 'Login bem-sucedido', user: { id: user.id, email: user.email } });
                });
            })(req, res, next);
        });
    }
}
