const Doctor = require('../models/Doctor');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

// Create a new doctor
exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization, email, phoneNumber, profileImage, status } = req.body;
    const doctor = await Doctor.create({ name, specialization, email, phoneNumber, profileImage, status });
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single doctor by ID
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a doctor
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    await doctor.update(req.body);
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    await doctor.destroy();
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// doctor csv
exports.exportDoctorsCSV = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();

    const data = doctors.map(d => ({
      id: d.id,
      name: d.name,
      specialization: d.specialization,
      email: d.email,
      phone: d.phone,
      status: d.status
    }));

    const fields = ['id', 'name', 'specialization', 'email', 'phone', 'status'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const filePath = path.join(__dirname, '../../uploads/doctors.csv');
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'doctors.csv');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};