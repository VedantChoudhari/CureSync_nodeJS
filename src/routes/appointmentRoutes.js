const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth'); // Uncomment if you want protected routes

router.post('/', /* auth, */ appointmentController.createAppointment);
router.get('/', /* auth, */ appointmentController.getAppointments);
router.get('/:id', /* auth, */ appointmentController.getAppointment);
router.put('/:id', /* auth, */ appointmentController.updateAppointment);
router.delete('/:id', /* auth, */ appointmentController.deleteAppointment);
router.get('/filter/by-date', auth, appointmentController.getAppointmentsByDate);
router.get('/filter/by-doctor', auth, appointmentController.getAppointmentsByDoctorAndDate);
router.get('/filter/by-patient', auth, appointmentController.getAppointmentsByPatientAndStatus);
router.get('/export/csv', auth, appointmentController.exportAppointmentsCSV);




module.exports = router;
