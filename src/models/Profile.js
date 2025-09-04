const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Profile = sequelize.define('Profile', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  dateOfBirth: { type: DataTypes.DATE },
  bloodGroup: { type: DataTypes.STRING },
  profileImage: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT }
}, {
  tableName: 'profiles',
  timestamps: true
});

// Association: Each Profile belongs to one User
Profile.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Profile, { foreignKey: 'userId' });

module.exports = Profile;