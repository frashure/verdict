const express = require('express');
const router = express.Router();

const controller = require('../controllers/usersController');

router.route('/')
    .get(controller.getUser)
    .post(controller.postUser);

module.exports = router;