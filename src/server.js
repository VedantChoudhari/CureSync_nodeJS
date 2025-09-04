require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');
const User = require('./models/User');
const Profile = require('./models/Profile');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    // Sync models
    sequelize.sync({ alter: true }) // Use { force: true } to drop and recreate tables
      .then(() => {
        console.log('Models synced!');
        app.listen(PORT, () => {
          console.log(`Server running on http://localhost:${PORT}`);
        });
      })
      .catch(err => {
        console.error('Model sync error:', err);
      });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });