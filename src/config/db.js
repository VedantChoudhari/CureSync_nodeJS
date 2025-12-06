// src/config/db.js
const { Sequelize } = require('sequelize');

const required = ['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing DB env vars: ${missing.join(', ')}`);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            // for many managed PG providers you need this
            rejectUnauthorized: false
          }
        }
      : {}
  }
);

// helper to connect and authenticate (useful in index.js)
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err);
    // fail fast in production-like environments
    if (process.env.NODE_ENV === 'production') process.exit(1);
    throw err;
  }
}

// keep backwards compatibility: require('./config/db') still returns the sequelize instance
module.exports = sequelize;
// also attach helper - works when requiring the module
module.exports.connectDB = connectDB;
