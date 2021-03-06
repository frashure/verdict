const bcrypt = require('bcrypt');
const db = require('../lib/db');
// const { json } = require('body-parser');
const fetch = require('node-fetch');

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
                        db.query('insert into users (email, password, first_name, last_name) values (?, ?, ?, ?)', [email, hash, req.body.firstName, req.body.lastName], (err, results) => {
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
                                    id: userID
                                }
                                req.login(user, (err) => {
                                    if (err) {
                                        console.log('User: ' + user)
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


    logoutUser: (req, res) => {
        req.logout();
        res.sendStatus(200);
    },

    getUser: (req, res) => {
        console.log('User: ' + JSON.stringify(req.user));
        db.query('select user_id, email, first_name, last_name from users where user_id = ?', [req.user.user_id], (err, results) => {
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

    addUserParty: (req, res) => {
        db.query('update users set party = ? where user_id = ?', [req.body.partyId, req.user.user_id], (err, results) => {
            if (err) {
                console.log('Party add error: ' + err);
            }
            else {
                console.log('Rows updated: ' + results.affectedRows);
                res.sendStatus(200);
            }
        })
    },

    getUserDistricts: (req, res) => {

        let url = 'https://www.googleapis.com/civicinfo/v2/representatives?address=' + req.body.address + '&key=' + process.env.civic_key;

        var countyPattern = /ocd-division\/country:us$/
        var statePattern = /ocd-division\/country:us\/state:(\D{2}$)/;
        var cdPattern = /ocd-division\/country:us\/state:va\/cd:/;
        var housePattern = /ocd-division\/country:us\/state:\D{2}\/sldl:/;
        var senatePattern = /ocd-division\/country:us\/state:\D{2}\/sldu:/;

        fetch(url, {headers: {'Content-Type': 'application/json'}})
            .then(response => response.json())
            .then(data => {
                let divisions = Object.keys(data.divisions);

                var countryPattern = /ocd-division\/country:us$/
                var statePattern = /ocd-division\/country:us\/state:(\D{2}$)/;
                var cdPattern = /ocd-division\/country:us\/state:va\/cd:/;
                var housePattern = /ocd-division\/country:us\/state:va\/sldl:/;
                var senatePattern = /ocd-division\/country:us\/state:va\/sldu:/;

                var districts = {}

                for (let i = 0; i < divisions.length; i++) {

                    console.log[i];
                    console.log('Current line: ' + divisions[i]);
                    if (divisions[i].match(statePattern) !== null) {
                        districts.state = divisions[i].match(/ocd-division\/country:us\/state:(\D{2}$)/)[1];
                        console.log('Object state: ' + districts.state);
                        continue;
                    }
                    else if (divisions[i].match(cdPattern) !== null) {
                        districts.cd = divisions[i].match(/ocd-division\/country:us\/state:va\/cd:(.*)/)[1];
                        console.log('Object cd: ' + districts.cd);
                        continue;
                    }
                    else if (divisions[i].match(housePattern) !== null) {
                        districts.stateLower = divisions[i].match(/ocd-division\/country:us\/state:va\/sldl:(.*)/)[1];
                        console.log('Object lower: ' + districts.stateLower);
                        continue;
                    }
                    else if (divisions[i].match(senatePattern) !== null) {
                        districts.stateUpper = divisions[i].match(/ocd-division\/country:us\/state:va\/sldu:(.*)/)[1];
                        console.log('Object upper: ' + districts.stateUpper);
                    }
                }

                db.query('insert into user_districts (user_id, legislature_id, district)' +
                    'select ' +
                        '?, ' +
                        'legislature_id, ' +
                        'case ' +
                            'when l.fed_state = \'f\' and l.upper_lower = \'l\' then ? ' +
                            'when l.fed_state = \'s\' and l.upper_lower = \'u\' then ? ' + 
                            'when l.fed_state = \'s\' and l.upper_lower = \'l\' then ? ' +
                            'else null ' +
                        'end ' +
                    'from legislatures l ' +
                    'where state = ? or state = \'US\'',
                    [req.user.user_id, districts.cd, districts.stateUpper, districts.stateLower, districts.state], (err, results) => {
                        if (err) {
                            console.log(req.user);
                            console.log(err);
                            throw err;
                        }
                        else {
                            console.log(results.affectedRows);
                            res.send(200);
                        }
                    })
            })
            .catch((e) => {
                console.log('Error: ' + e.message);
                res.sendStatus(404);
            });
    },

    getUserRelationships: (req, res) => {
        db.query('select * from user_relationships where user1 = ?', [req.user.user_id], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                res.status(200).json(results);
            }
        })
    },

    addUserRelationship: (req, res) => {

        let relationshipType2;
        switch(req.body.relationshipType) {
            case 'p': relationshipType2 = 'r';
            break;
            case 'b': relationshipType2 = 'x';
            break;

        }

        let insertValues = [
            [req.user.user_id, req.body.user2, req.body.relationshipType],
            [req.body.user2, req.user.user_id, relationshipType2]
        ]
        // TODO: [VER-13] Add check constraint to ensure user1 != user2
        db.query('insert into user_relationships (user1, user2, type) values ?', [insertValues], (err, results) => {
            if (err) {
                console.log(err);
                res.sendStatus(409);
                // throw err;
            }
            else {
                console.log(results.affectedRows);
                res.sendStatus(200);
            }
        })
    },

    approveFriendRequest: (req, res) => {

        let insertValues = [
            [req.user.user_id, req.body.user2, 'r'],
            [req.body.user2, req.user.user_id, 'p']
        ]

        // db.query('update user_relationships set type = f where user1 = ? and user 2 = ? and type = ?')
    },

    getUserEndorsements: (req, res) => {
        db.query('select c.* from endorsements e join candidates c on e.candidate_id = c.candidate_id where e.user_id = ?', [req.user.user_id], (err, results) => {
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
        db.query('insert into endorsements (user_id, candidate_id, election_id) values (?, ?, ?)', [req.user.user_id, req.body.candidateId, req.body.electionId], (err, results) => {
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
        db.query('delete from endorsements where concat(user_id, candidate_id, election_id) = concat(?, ?, ?)', [req.user.user_id, req.body.candidateId, req.body.electionId], (err, results) => {
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
        db.query('select user2 from userRelationships where user1 = ?', [req.user.user_id], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                res.json(results);
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