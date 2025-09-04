const OPD = require('../models/OPD');
const Doctor = require('../models/Doctor');

// Create a new OPD
exports.createOPD = async (req, res) => {
  try {
    const { name, doctorId, description, status } = req.body;
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const opd = await OPD.create({ name, doctorId, description, status });
    res.status(201).json(opd);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all OPDs
exports.getOPDs = async (req, res) => {
  try {
    const opds = await OPD.findAll({ include: Doctor });
    res.json(opds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single OPD by ID
exports.getOPD = async (req, res) => {
  try {
    const opd = await OPD.findByPk(req.params.id, { include: Doctor });
    if (!opd) return res.status(404).json({ error: 'OPD not found' });
    res.json(opd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an OPD
exports.updateOPD = async (req, res) => {
  try {
    const opd = await OPD.findByPk(req.params.id);
    if (!opd) return res.status(404).json({ error: 'OPD not found' });
    await opd.update(req.body);
    res.json(opd);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an OPD
exports.deleteOPD = async (req, res) => {
  try {
    const opd = await OPD.findByPk(req.params.id);
    if (!opd) return res.status(404).json({ error: 'OPD not found' });
    await opd.destroy();
    res.json({ message: 'OPD deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
