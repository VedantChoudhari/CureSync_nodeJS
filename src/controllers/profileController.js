const Profile = require('../models/Profile');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Create a new profile
exports.createProfile = async (req, res) => {
  try {
    const { userId, name, gender, age, dateOfBirth, bloodGroup, phoneNumber, address } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    const profile = await Profile.create({
      userId,
      name,
      gender,
      age,
      dateOfBirth,
      bloodGroup,
      profileImage,
      phoneNumber,
      address
    });
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

    // If new file uploaded, delete old file
    let profileImage = profile.profileImage;
    if (req.file) {
      profileImage = req.file.filename;

      if (profile.profileImage) {
        const oldPath = path.join(__dirname, '../uploads', profile.profileImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await profile.update({ ...req.body, profileImage });
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

    // Delete associated file
    if (profile.profileImage) {
      const filePath = path.join(__dirname, '../uploads', profile.profileImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await profile.destroy();
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
