const express = require('express');
const { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect, requirePermission } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const upload = makeUploader('documents');
router.use(protect);

router.route('/')
  .get(requirePermission('suppliers', 'view'), getSuppliers)
  .post(requirePermission('suppliers', 'create'), upload.array('documents', 5), createSupplier);
router.route('/:id')
  .get(requirePermission('suppliers', 'view'), getSupplierById)
  .put(requirePermission('suppliers', 'edit'), upload.array('documents', 5), updateSupplier)
  .delete(requirePermission('suppliers', 'delete'), deleteSupplier);

module.exports = router;
