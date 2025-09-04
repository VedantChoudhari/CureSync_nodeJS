const { Op, fn, col } = require('sequelize');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const OPD = require('../models/OPD');
const Inventory = require('../models/Inventory');

exports.getDashboardStats = async (req, res) => {
  try {
    // Last 7 days
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 6);

    // 1️⃣ Appointments per day with doctor names
    const appointmentsPerDay = await Appointment.findAll({
      attributes: [
        [fn('DATE', col('appointmentDate')), 'date'],
        'doctorId',
        [fn('COUNT', col('Appointment.id')), 'totalAppointments']
      ],
      where: {
        appointmentDate: { [Op.between]: [lastWeek, today] }
      },
      group: ['date', 'doctorId', 'Doctor.id', 'Doctor.name'],
      order: [[col('date'), 'ASC']],
      include: [
        { model: Doctor, attributes: ['id', 'name'] }
      ]
    });

    // 2️⃣ Appointments per doctor (total)
    const appointmentsPerDoctor = await Appointment.findAll({
      attributes: [
        'doctorId',
        [fn('COUNT', col('Appointment.id')), 'totalAppointments']
      ],
      group: ['doctorId', 'Doctor.id', 'Doctor.name'],
      include: [
        { model: Doctor, attributes: ['id', 'name'] }
      ]
    });

    // 3️⃣ Total OPDs
    const totalOPDs = await OPD.count();

    // 4️⃣ Inventory low stock
    const lowStockItems = await Inventory.findAll({
      where: { quantity: { [Op.lt]: 10 } }
    });

    res.json({
      appointmentsPerDay,
      appointmentsPerDoctor,
      totalOPDs,
      lowStockItems
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
