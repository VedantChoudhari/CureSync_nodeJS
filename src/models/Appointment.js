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
  status: { type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'), defaultValue: 'scheduled' },
  notes: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'appointments',
  timestamps: true
});

// Associations
Appointment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Appointment, { foreignKey: 'userId' });

Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });

Appointment.belongsTo(OPD, { foreignKey: 'opdId', onDelete: 'CASCADE' });
OPD.hasMany(Appointment, { foreignKey: 'opdId' });

module.exports = Appointment;
