// src/seed/seeders.js
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const OPD = require('../models/OPD');

const DOCTORS_TO_SEED = [
  {
    username: 'dr_smith',
    email: 'dr.smith@example.com',
    password: 'DoctorPass123!', // seeded password (hashed before saving)
    name: 'Dr. John Smith',
    specialization: 'Cardiology',
    phoneNumber: '+911234567001',
    opds: [
      { name: 'City Heart OPD', specialization: 'Cardiology', bedsTotal: 10, bedsAvailable: 3, location: 'Sector 5, Aurangabad', contact: '+911234567001' }
    ]
  },
  {
    username: 'dr_rao',
    email: 'dr.rao@example.com',
    password: 'DoctorPass123!',
    name: 'Dr. Priya Rao',
    specialization: 'General Medicine',
    phoneNumber: '+911234567002',
    opds: [
      { name: 'Downtown General OPD', specialization: 'General Medicine', bedsTotal: 8, bedsAvailable: 2, location: 'MG Road, Aurangabad', contact: '+911234567002' }
    ]
  }
];

async function seedDoctorsAndOpds() {
  try {
    for (const d of DOCTORS_TO_SEED) {
      // 1) Ensure User row with role 'doctor' exists
      let user = await User.findOne({ where: { email: d.email } });
      if (!user) {
        const hashed = await bcrypt.hash(d.password, 10);
        user = await User.create({
          username: d.username,
          email: d.email,
          password: hashed,
          role: 'doctor'
        });
        console.log(`Seed: created user ${d.username}`);
      } else {
        // If role not doctor, force set (careful on production — here we only set if it's not set)
        if (user.role !== 'doctor') {
          user.role = 'doctor';
          await user.save();
          console.log(`Seed: updated user role to 'doctor' for ${d.email}`);
        } else {
          console.log(`Seed: user exists ${d.email}`);
        }
      }

      // 2) Ensure Doctor profile exists
      let doctor = await Doctor.findOne({ where: { email: d.email } });
      if (!doctor) {
        doctor = await Doctor.create({
          name: d.name,
          specialization: d.specialization,
          email: d.email,
          phoneNumber: d.phoneNumber,
          profileImage: null,
          status: 'active'
        });
        console.log(`Seed: created Doctor row for ${d.name}`);
      } else {
        console.log(`Seed: Doctor entry exists for ${d.email}`);
      }

      // 3) Create OPDs for this doctor if they don't already exist
      for (const opdData of (d.opds || [])) {
        const exists = await OPD.findOne({
          where: { name: opdData.name, doctorId: doctor.id }
        });
        if (!exists) {
          await OPD.create({
            name: opdData.name,
            doctorId: doctor.id,
            description: opdData.description || '',
            status: 'active',
            specialization: opdData.specialization || d.specialization,
            bedsTotal: opdData.bedsTotal || 0,
            bedsAvailable: opdData.bedsAvailable || 0,
            location: opdData.location || '',
            contact: opdData.contact || ''
          });
          console.log(`Seed: created OPD '${opdData.name}' for ${d.name}`);
        } else {
          console.log(`Seed: OPD '${opdData.name}' already exists for ${d.name}`);
        }
      }
    }
    console.log('Seeding finished.');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

module.exports = { seedDoctorsAndOpds };
