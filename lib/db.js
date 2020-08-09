const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.dbHost,
    port: process.env.dbPort,
    user: process.env.dbUser,
    password: process.env.dbPass,
    database: process.env.dbSchema
});

module.exports = connection;