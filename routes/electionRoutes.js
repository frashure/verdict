const express = require('express');
const router = express.Router();
const controller = require('../controllers/electionController');

router.get('/getByID', controller.getById);
router.get('/getByState');
router.get('/getByDistrict');