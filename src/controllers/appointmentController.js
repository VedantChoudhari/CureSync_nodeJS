const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const OPD = require('../models/OPD');
const { Parser } = require('json2csv');
const sendSMS = require('../utils/sms');
const Profile = require('../models/Profile'); 

// Create appointment (with file upload + SMS)
exports.createAppointment = async (req, res) => {
  try {
    const { userId, doctorId, opdId, appointmentDate, notes } = req.body;
    const document = req.file ? req.file.filename : null;

    const appointment = await Appointment.create({
      userId,
      doctorId,
      opdId,
      appointmentDate,
      notes,
      document
    });

    // fetch patient phone number (from Profile model)
    const profile = await Profile.findOne({ where: { userId } });
    if (profile?.phoneNumber) {
      await sendSMS(profile.phoneNumber, `✅ Your appointment is booked for ${appointmentDate}`);
    }

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single appointment
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update appointment (with SMS)
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    let document = appointment.document;
    if (req.file) {
      document = req.file.filename;

      if (appointment.document) {
        const oldPath = path.join(__dirname, '../uploads', appointment.document);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await appointment.update({ ...req.body, document });

    // SMS notification
    const profile = await Profile.findOne({ where: { userId: appointment.userId } });
    if (profile?.phoneNumber) {
      await sendSMS(profile.phoneNumber, `✏️ Your appointment on ${appointment.appointmentDate} has been updated.`);
    }

    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Delete appointment (with SMS)
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    if (appointment.document) {
      const filePath = path.join(__dirname, '../uploads', appointment.document);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    const userId = appointment.userId;
    const appointmentDate = appointment.appointmentDate;

    await appointment.destroy();

    // SMS notification
    const profile = await Profile.findOne({ where: { userId } });
    if (profile?.phoneNumber) {
      await sendSMS(profile.phoneNumber, `❌ Your appointment on ${appointmentDate} has been canceled.`);
    }

    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get appointments filtered by date
exports.getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query; // format: YYYY-MM-DD
    if (!date) return res.status(400).json({ error: 'Date query parameter required' });

    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.findAll({
      where: {
        appointmentDate: {
          [Op.between]: [start, end]
        }
      }
    });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get appointments filtered by doctor and date range
exports.getAppointmentsByDoctorAndDate = async (req, res) => {
  try {
    const { doctorId, startDate, endDate } = req.query;

    const query = {};
    if (doctorId) query.doctorId = doctorId;
    if (startDate && endDate) {
      query.appointmentDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    // RBAC filtering
    if (req.user.role === 'doctor') query.doctorId = req.user.id;
    if (req.user.role === 'patient') query.userId = req.user.id;

    const appointments = await Appointment.findAll({
      where: query,
      include: [Doctor, User, OPD],
      order: [['appointmentDate', 'ASC']]
    });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAppointmentsByPatientAndStatus = async (req, res) => {
  try {
    const { patientId, status } = req.query;
    const query = {};

    if (patientId) query.userId = patientId;
    if (status) query.status = status;

    // RBAC filtering
    if (req.user.role === 'patient') query.userId = req.user.id;
    if (req.user.role === 'doctor') query.doctorId = req.user.id;

    const appointments = await Appointment.findAll({
      where: query,
      include: [Doctor, User, OPD],
      order: [['appointmentDate', 'ASC']]
    });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//appointment report 
exports.exportAppointmentsCSV = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [User, Doctor, OPD]
    });

    const data = appointments.map(a => ({
      id: a.id,
      patient: a.User ? a.User.username : '',
      doctor: a.Doctor ? a.Doctor.name : '',
      opd: a.OPD ? a.OPD.name : '',
      appointmentDate: a.appointmentDate,
      notes: a.notes || '',
      document: a.document || ''
    }));

    const fields = ['id', 'patient', 'doctor', 'opd', 'appointmentDate', 'notes', 'document'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const filePath = path.join(__dirname, '../../uploads/appointments.csv');
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'appointments.csv');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





