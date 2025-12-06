// src/models/OPD.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./Doctor');

const OPD = sequelize.define('OPD', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
  specialization: { type: DataTypes.STRING, allowNull: true },

  // New fields:
  bedsTotal: { type: DataTypes.INTEGER, defaultValue: 0 },
  bedsAvailable: { type: DataTypes.INTEGER, defaultValue: 0 },
  // simple location string (address). If you later want lat/lng, change to DECIMAL fields.
  location: { type: DataTypes.STRING, allowNull: true },
  contact: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'opds',
  timestamps: true
});

// Association: An OPD belongs to a Doctor
OPD.belongsTo(Doctor, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
Doctor.hasMany(OPD, { foreignKey: 'doctorId' });

module.exports = OPD;
