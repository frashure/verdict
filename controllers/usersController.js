const bcrypt = require('bcrypt');
const db = require('../lib/db');
const { json } = require('body-parser');

const controller = {

    //TODO: [VER-10] Get user legislative districts by address
    
    createUser: (req, res) => {
        console.log('Session: ' + JSON.stringify(req.session));
        const username = req.body.username;
        const email = req.body.email;
        const pw = req.body.password;
        const saltRounds = 10;
        var userID;

        //TODO: [VER-9] Validate createUser inputs

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
    },

    getUserEndorsements: (req, res) => {
        db.query('select c.* from endorsements e join candidates c where e.user_id = ?', [req.user.id], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                res.json(buildCandidate(results));
            }
        })
    },

    addUserEndorsement: (req, res) => {
        db.query('insert into endorsements (user_id, candidate_id, election_id) values (?, ?, ?)', [req.user.id, req.body.candidateId, req.body.electionId], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                // need to verify one row inserted
                res.sendStatus(200);
            }
        })
    },

    removeUserEndorsement: (req, res) => {
        db.query('delete from endorsements where concat(user_id, candidate_id, election_id) = concat(?, ?, ?)', [req.user.id, req.body.candidateId, req.body.electionId], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                // verify one record deleted
                res.sendStatus(200);
            }
        })
    },

    getRelationships: (req, res) => {
        db.query('select user2 from userRelationships where user1 = ?', [req.user.id], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                res.json(results);
            }
        })
    },

    addRelationship: (req, res) => {
        db.query('insert into user_relationships (user1, user2, type) values (?, ?, ?)', [req.user.id, req.body.user2, req.body.relationshipType], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                res.sendStatus(200);
            }
        })
    }

};

function buildCandidate (results) {
    let candidates = [];

    for (var i = 0; i < results.length; i++) {
        let candidate = {
            firstName: results[i].first_name,
            lastName: results[i].last_name,
            party: results[i].party
        }
        candidates.push(candidate);
    }

    return candidates;

}

module.exports = controller;