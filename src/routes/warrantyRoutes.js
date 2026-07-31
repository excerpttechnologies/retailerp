const express = require('express');
const { createWarranty, getWarranties } = require('../controllers/warrantyController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(requirePermission('service', 'view'), getWarranties)
  .post(requirePermission('service', 'create'), createWarranty);

module.exports = router;
