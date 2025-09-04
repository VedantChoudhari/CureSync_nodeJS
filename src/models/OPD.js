const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./Doctor');

const OPD = sequelize.define('OPD', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' }
}, {
  tableName: 'opds',
  timestamps: true
});

// Association: An OPD belongs to a Doctor
OPD.belongsTo(Doctor, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
Doctor.hasMany(OPD, { foreignKey: 'doctorId' });

module.exports = OPD;
