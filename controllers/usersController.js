const bcrypt = require('bcrypt');
const db = require('../lib/db');

const controller = {
    
    createUser: (req, res) => {
        console.log('Session: ' + JSON.stringify(req.session));
        const username = req.body.username;
        const email = req.body.email;
        const pw = req.body.password;
        const saltRounds = 10;
        var userID;

        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                console.log('Salt gen error: ' + err);
                let error = {
                    message: "Salt gen error"
                }
                res.json(error);
            }
            else {
                bcrypt.hash(pw, salt, (err, hash) => {
                    if (err) {
                        console.log('Hash error: ' + err);
                        throw err;
                    }
                    else {
                        db.query('insert into users (username, email, password) values (?, ?, ?)', [username, email, hash], (err, results) => {
                            if (err) {
                                console.log('Insert query error: ' + err);
                                let error = {
                                    message: 'Duplicate entry: ' + err
                                }
                                res.status(409).json(error);
                            }
                            else {
                                console.log('Inserted ID: ' + results.insertId);
                                userID = results.insertId;
                                user = {
                                    id: userID,
                                    name: username
                                }
                                req.login(user, (err) => {
                                    if (err) {
                                        console.log('Login error: ' + err);
                                        res.status(500).json(err);
                                    }
                                    else {
                                        res.status(200).json(user);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });


    },

    loginUser: (req, res) => {
        res.sendStatus(200);
    },

    getUser: (req, res) => {
        console.log('User: ' + JSON.stringify(req.user));
        db.query('select username, email from users where id = ?', [req.user.id], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                res.json(results);
            }
        })
    },

    postUser: (req, res) => {
        res.send("postUser route succeeded!");
    }
}

module.exports = controller;