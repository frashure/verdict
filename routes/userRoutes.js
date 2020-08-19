const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/usersController');

router.route('/')
    .get(isLoggedIn, controller.getUser)
    .post(controller.createUser);
router.route('/login')
    .post(passport.authenticate('local'), controller.loginUser);
router.route('/logout')
    .post(isLoggedIn, controller.logoutUser)
router.route('/relationships')
    .get(isLoggedIn, controller.getUserRelationships)
    .post(isLoggedIn, controller.addUserRelationship);
// router.route('/relationships/friends')
//     .get(isLoggedIn)
router.route('/endorsements')
    .get(isLoggedIn, controller.getUserEndorsements)
    .post(isLoggedIn, controller.addUserEndorsement)
    .delete(isLoggedIn, controller.removeUserEndorsement)
router.route('/districts')
    .get(isLoggedIn, controller.getUserDistricts);

function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.sendStatus(403);
    }
};

module.exports = router;