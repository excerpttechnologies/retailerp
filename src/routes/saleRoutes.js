const express = require('express');
const { createSale, getSales, getSaleById, cancelSale } = require('../controllers/saleController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(requirePermission('sales', 'view'), getSales)
  .post(requirePermission('sales', 'create'), createSale);
router.get('/:id', requirePermission('sales', 'view'), getSaleById);
router.patch('/:id/cancel', requirePermission('sales', 'edit'), cancelSale);

module.exports = router;
