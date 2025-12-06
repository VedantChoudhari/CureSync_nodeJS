// src/app.js
const express = require('express');
const path = require('path');
const cors = require('cors');        // <-- new
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - allow your frontend origin (change if needed)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true, // if you want to send cookies (not required for bearer token)
}));

// Serve static frontend files (if you serve frontend from backend)
app.use(express.static(path.join(__dirname, "../public")));

// Optional: default route to index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add API routes
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const opdRoutes = require('./routes/opdRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/opds', opdRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handler (simple)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
