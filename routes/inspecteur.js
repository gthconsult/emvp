const express = require('express');
const router = express.Router();
const InspecteurController = require('../controllers/InspecteurController');


router.get('/add', InspecteurController.add);


module.exports = router;