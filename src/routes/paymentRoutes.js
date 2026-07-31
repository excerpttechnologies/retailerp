const express = require('express');
const { createPayment, getPayments, deletePayment } = require('../controllers/paymentController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(requirePermission('finance', 'view'), getPayments)
  .post(requirePermission('finance', 'create'), createPayment);
router.delete('/:id', requirePermission('finance', 'delete'), deletePayment);

module.exports = router;
