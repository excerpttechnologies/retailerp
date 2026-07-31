const express = require('express');
const {
  createPurchaseOrder, getPurchaseOrders, getPurchaseOrderById,
  sendPurchaseOrder, receivePurchaseOrder, cancelPurchaseOrder,
} = require('../controllers/purchaseOrderController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(requirePermission('purchaseOrders', 'view'), getPurchaseOrders)
  .post(requirePermission('purchaseOrders', 'create'), createPurchaseOrder);
router.get('/:id', requirePermission('purchaseOrders', 'view'), getPurchaseOrderById);
router.patch('/:id/send', requirePermission('purchaseOrders', 'edit'), sendPurchaseOrder);
router.post('/:id/receive', requirePermission('purchaseOrders', 'edit'), receivePurchaseOrder);
router.patch('/:id/cancel', requirePermission('purchaseOrders', 'edit'), cancelPurchaseOrder);

module.exports = router;
