const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./lib/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const port = process.env.port || 3232;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'alksjdvkla2432uoiuyaw4ouhtjlzh52',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore({
        host: process.env.dbHost,
        port: process.env.dbPort,
        user: process.env.dbUser,
        password: process.env.dbPass,
        database: process.env.dbSchema
    }),
    cookie: {secure: false}
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({
    passReqToCallback: false,
    usernameField: 'email'},
    (email, password, done) => {
        db.query('select * from users where email = ?', [email], (err, results) => {
            if (err) {
                console.log('Local strategy login err: ' + err);
                throw err;
            }
            else if (results.length < 1) {
                console.log('Email not found');
                return done(null, false);
            }
            else if (!bcrypt.compareSync(password, results[0].password)) {
                console.log('Incorrect password');
                return done(null, false)
            }
            else {
                return done(null, results[0]);
            }
        }
        )
    }
));

passport.serializeUser((user, done) => {
    console.log('Serializing user...');
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('Deserializing user...');
    db.query('select * from users where id = ?', [id], (err, results) => {
        if (err) {
            console.log('Deserialize query error: ' + err);
            throw err;
        }
        else {
            console.log('Deserialized results: ' + JSON.stringify(results[0]));
            done(null, results[0]);
        }
    })
});

const usersRoutes = require('./routes/userRoutes');
app.use('/users', usersRoutes);

app.listen(port, () => {
    console.log(`Verdict app listening on port ${port}`);
});