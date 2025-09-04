const Profile = require('../models/Profile');
const User = require('../models/User');

// Create a new profile
exports.createProfile = async (req, res) => {
  try {
    const { userId, name, gender, age, dateOfBirth, bloodGroup, profileImage, phoneNumber, address } = req.body;
    const profile = await Profile.create({ userId, name, gender, age, dateOfBirth, bloodGroup, profileImage, phoneNumber, address });
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all profiles
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll({ include: User });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single profile by ID
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id, { include: User });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a profile
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    await profile.update(req.body);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a profile
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    await profile.destroy();
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};