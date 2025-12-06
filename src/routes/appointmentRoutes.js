// src/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth'); // Uncomment if you want protected routes

// Create and list (non-param) routes
router.post('/', /* auth, */ appointmentController.createAppointment);
router.get('/', /* auth, */ appointmentController.getAppointments);

// IMPORTANT: put filter/export routes BEFORE param routes (:id)
// so routes like /filter/by-date won't be treated as id = 'filter'
router.get('/filter/by-date', auth, appointmentController.getAppointmentsByDate);
router.get('/filter/by-doctor', auth, appointmentController.getAppointmentsByDoctorAndDate);
router.get('/filter/by-patient', auth, appointmentController.getAppointmentsByPatientAndStatus);
router.get('/export/csv', auth, appointmentController.exportAppointmentsCSV);

// Param routes for single appointment
router.get('/:id', /* auth, */ appointmentController.getAppointment);
router.put('/:id', /* auth, */ appointmentController.updateAppointment);
router.delete('/:id', /* auth, */ appointmentController.deleteAppointment);

module.exports = router;
