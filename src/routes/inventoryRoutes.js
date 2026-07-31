const express = require('express');
const { adjustStock, getStockLedger, getLowStock } = require('../controllers/inventoryController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/adjust', requirePermission('inventory', 'edit'), adjustStock);
router.get('/ledger', requirePermission('inventory', 'view'), getStockLedger);
router.get('/low-stock', requirePermission('inventory', 'view'), getLowStock);

module.exports = router;
