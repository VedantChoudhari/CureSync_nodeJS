const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth'); // Uncomment if you want protected routes

router.post('/', /* auth, */ doctorController.createDoctor); // Protected if needed
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctor);
router.put('/:id', /* auth, */ doctorController.updateDoctor);
router.delete('/:id', /* auth, */ doctorController.deleteDoctor);
router.get('/export/csv', auth, doctorController.exportDoctorsCSV);



module.exports = router;
