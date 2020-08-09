const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
require('dotenv').config();

const port = process.env.port || 3232;

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json);

app.use(session({
    secret: 'alksjdvkla2432uoiuyaw4ouhtjlzh52',
    resave: true,
    saveUninitialized: true,
    store: new mysqlStore({
        host: process.env.dbHost,
        port: process.env.dbPort,
        user: process.env.dbUser,
        password: process.env.dbPass,
        database: process.env.dbSchema
    })
}))

const usersRoutes = require('./routes/userRoutes');
app.use('/users', usersRoutes);

app.listen(port, () => {
    console.log(`Verdict app listening on port ${port}`);
});