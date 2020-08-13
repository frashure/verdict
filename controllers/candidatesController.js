const db = require('../lib/db');

const controller = {

    getByID: (req, res) => {
        db.query('select * from candidates where candidate_id = ?', [req.body.candidate_id], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                res.json(results);
            }
        });
    },

    getByName: (req, res) => {
        db.query('select * from candidates where concat(first_name, last_name) like ?'%'?', [req.body.first_name, req.body.last_name], (err, results) => {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                res.json(results);
            }
        });
    }

}

module.exports = controller;