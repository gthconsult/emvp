const express = require('express');
const router = express.Router();
const InspecteurController = require('../controllers/InspecteurController');


router.post('/add', InspecteurController.add);
router.get('/get/:identite',InspecteurController.get);



module.exports = router;