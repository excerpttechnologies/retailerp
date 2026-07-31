const express = require('express');
const { getCompanyDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.get('/', protect, getCompanyDashboard);

module.exports = router;
