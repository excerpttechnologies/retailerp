const express = require('express');
const {
  getDeliveryRecords,
  getDeliveryRecordById,
  createDeliveryRecord,
  updateDeliveryRecord,
  deleteDeliveryRecord,
  getGoodsPurchaseRecords,
  getGoodsPurchaseRecordById,
  createGoodsPurchaseRecord,
  updateGoodsPurchaseRecord,
  deleteGoodsPurchaseRecord,
  getBarcodeRecords,
  getBarcodeRecordById,
  createBarcodeRecord,
  updateBarcodeRecord,
  deleteBarcodeRecord,
  getPurchaseReturns,
  getPurchaseReturnById,
  createPurchaseReturnRecord,
  updatePurchaseReturnRecord,
  deletePurchaseReturnRecord,
} = require('../controllers/purchaseController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/delivery', requirePermission('purchase', 'view'), getDeliveryRecords);
router.get('/delivery/:id', requirePermission('purchase', 'view'), getDeliveryRecordById);
router.post('/delivery', requirePermission('purchase', 'create'), createDeliveryRecord);
router.put('/delivery/:id', requirePermission('purchase', 'edit'), updateDeliveryRecord);
router.delete('/delivery/:id', requirePermission('purchase', 'delete'), deleteDeliveryRecord);

router.get('/goods-purchase', requirePermission('purchase', 'view'), getGoodsPurchaseRecords);
router.get('/goods-purchase/:id', requirePermission('purchase', 'view'), getGoodsPurchaseRecordById);
router.post('/goods-purchase', requirePermission('purchase', 'create'), createGoodsPurchaseRecord);
router.put('/goods-purchase/:id', requirePermission('purchase', 'edit'), updateGoodsPurchaseRecord);
router.delete('/goods-purchase/:id', requirePermission('purchase', 'delete'), deleteGoodsPurchaseRecord);

router.get('/barcode', requirePermission('purchase', 'view'), getBarcodeRecords);
router.get('/barcode/:id', requirePermission('purchase', 'view'), getBarcodeRecordById);
router.post('/barcode', requirePermission('purchase', 'create'), createBarcodeRecord);
router.put('/barcode/:id', requirePermission('purchase', 'edit'), updateBarcodeRecord);
router.delete('/barcode/:id', requirePermission('purchase', 'delete'), deleteBarcodeRecord);

router.get('/purchase-return', requirePermission('purchase', 'view'), getPurchaseReturns);
router.get('/purchase-return/:id', requirePermission('purchase', 'view'), getPurchaseReturnById);
router.post('/purchase-return', requirePermission('purchase', 'create'), createPurchaseReturnRecord);
router.put('/purchase-return/:id', requirePermission('purchase', 'edit'), updatePurchaseReturnRecord);
router.delete('/purchase-return/:id', requirePermission('purchase', 'delete'), deletePurchaseReturnRecord);

router.get('/goods-return', requirePermission('purchase', 'view'), getPurchaseReturns);
router.get('/goods-return/:id', requirePermission('purchase', 'view'), getPurchaseReturnById);
router.post('/goods-return', requirePermission('purchase', 'create'), createPurchaseReturnRecord);
router.put('/goods-return/:id', requirePermission('purchase', 'edit'), updatePurchaseReturnRecord);
router.delete('/goods-return/:id', requirePermission('purchase', 'delete'), deletePurchaseReturnRecord);

module.exports = router;
