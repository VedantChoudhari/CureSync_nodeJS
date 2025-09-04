const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Doctor = require('./Doctor');
const OPD = require('./OPD');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  opdId: { type: DataTypes.INTEGER, allowNull: false },
  appointmentDate: { type: DataTypes.DATE, allowNull: false },
  notes: { type: DataTypes.TEXT },
  document: { type: DataTypes.STRING }, // filename of uploaded document
  status: { type: DataTypes.ENUM('pending', 'completed', 'cancelled'), defaultValue: 'pending' }
}, {
  tableName: 'appointments',
  timestamps: true
});

// Associations
Appointment.belongsTo(User, { foreignKey: 'userId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
Appointment.belongsTo(OPD, { foreignKey: 'opdId' });

module.exports = Appointment;
