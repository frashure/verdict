const db = require('../lib/db');

const controller = {

    getById: (req, res) => {
        db.query('select * from elections where election_id = ?', [req.body.election_id], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                res.json(results);
            }
        })
    },

    getByState: (req, res) => {
        
    }

}

module.exports = controller;