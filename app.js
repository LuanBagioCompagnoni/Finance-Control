import express from 'express';
import session from 'express-session';
import { create } from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import routes from './src/routes/index.js'

dotenv.config();
import UserModel from './src/models/user.js';

const app = express();
const hbs = create({extname: '.hbs'})

mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then()

// Middleware
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(new localStrategy({ usernameField: 'email' }, async function (email, password, done) {
    try {
        const user = await UserModel.findOne({email})

        if (!user) return done(null, false, {message: 'Incorrect e-mail'})
        console.log(password, user)

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user)
    } catch (err) {
        return done(err);
    }
}))

routes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
