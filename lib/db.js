const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPass,
    database: process.env.dbSchema
});

module.exports = connection;