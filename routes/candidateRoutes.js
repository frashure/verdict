const express = require('express');
const router = express.Router();
const controller = require('../controllers/candidatesController');

router.get('/getByID', controller.getByID);
router.get('/getByName', controller.getByName);


function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.sendStatus(403);
    }
};