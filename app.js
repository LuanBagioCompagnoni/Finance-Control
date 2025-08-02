import express from 'express';
import session from 'express-session';
import { create } from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import cors from 'cors';

dotenv.config();
import UserModel from './src/models/user.js';

import { comparePassword } from "./src/helpers/password.js";

const app = express();
const hbs = create({extname: '.hbs'})

mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

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
        const user = await UserModel.findOne({ email })

        if (!user) return done(null, false, { message: 'Incorrect e-mail' })

        const isMatch = await comparePassword(password, user.passwordData.password, user.passwordData.salt.toString());

        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user)
    } catch (err) {
        return done(err);
    }
}))

routes(app);

if (!process.env.PORT) {
    console.log('Process port not specified');
    process.exit(1);
}
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
