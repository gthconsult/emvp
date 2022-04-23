const express = require('express');
const router = express.Router();
const InspecteurController = require('../controllers/InspecteurController');


router.post('/add', InspecteurController.add);
router.get('/get/:identite',InspecteurController.get);
router.get('/delete/:iid',InspecteurController.delete);
router.post('/edit',InspecteurController.edit);



module.exports = router;