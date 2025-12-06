// // src/index.js
// require('dotenv').config();

// const app = require('./app');           // IMPORTANT: './app' because this file is in src/
// const sequelize = require('./config/db');

// // optional: ensure JWT secret exists (recommended)
// if (!process.env.JWT_SECRET) {
//   console.warn('⚠️  Warning: JWT_SECRET is not set. Auth will fail if routes require JWT.');
//   // don't exit here because you might be running local tests; remove the line below if you want strict behavior
//   // process.exit(1);
// }

// const PORT = process.env.PORT || 3000;

// (async function start() {
//   try {
//     // If connectDB helper exists (we attached it in the modified db.js), use it
//     if (typeof sequelize.connectDB === 'function') {
//       await sequelize.connectDB();
//     } else {
//       await sequelize.authenticate();
//       console.log('Database authenticated (fallback)');
//     }

//     // Use non-destructive sync in production
//     if (process.env.NODE_ENV === 'production') {
//       await sequelize.sync();
//       console.log('Models synced (production - sync())');
//     } else {
//       await sequelize.sync({ alter: true });
//       console.log('Models synced (development - alter applied)');
//     }

//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error('Startup error:', err);
//     process.exit(1);
//   }
// })();


// src/index.js
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');

// import models so associations are registered (if you rely on import order)
// require('./models/User');
// require('./models/Profile');
// require('./models/Doctor');
// require('./models/OPD');
// require('./models/Appointment');
// require('./models/Inventory');

const { seedDoctorsAndOpds } = require('./seed/seeders');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models: alter:true will adjust DB to model changes (safe for dev; for prod consider migrations)
    await sequelize.sync({ alter: true });
    console.log('Models synced (development - alter applied)');

    // Seed doctors & OPDs (idempotent - safe to call multiple times)
    await seedDoctorsAndOpds();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();
