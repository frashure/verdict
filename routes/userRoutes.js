const express = require('express');
const router = express.Router();
const passport = require('passport');

const controller = require('../controllers/usersController');

router.route('/')
    .get(isLoggedIn, controller.getUser)
    .post(controller.createUser);
router.route('/login')
    .post(passport.authenticate('local'), controller.loginUser);

function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.sendStatus(403);
    }
};

module.exports = router;