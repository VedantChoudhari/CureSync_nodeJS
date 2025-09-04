const express = require('express');
const router = express.Router();
const opdController = require('../controllers/opdController');
const auth = require('../middleware/auth'); // Uncomment to protect routes

router.post('/', /* auth, */ opdController.createOPD); // Create OPD
router.get('/', opdController.getOPDs); // Get all OPDs
router.get('/:id', opdController.getOPD); // Get single OPD
router.put('/:id', /* auth, */ opdController.updateOPD); // Update OPD
router.delete('/:id', /* auth, */ opdController.deleteOPD); // Delete OPD
router.get('/filter/by-doctor', auth, opdController.getOPDsByDoctor);
router.get('/filter/by-specialization', auth, opdController.getOPDsBySpecialization);



module.exports = router;
