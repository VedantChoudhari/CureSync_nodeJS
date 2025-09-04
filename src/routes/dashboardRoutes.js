const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, role(['admin']), dashboardController.getDashboardStats);

module.exports = router;
