const express = require('express');
const { createDelivery, getDeliveries, updateDeliveryStatus } = require('../controllers/deliveryController');
const { protect, requirePermission } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const upload = makeUploader('documents');
router.use(protect);

router.route('/')
  .get(requirePermission('logistics', 'view'), getDeliveries)
  .post(requirePermission('logistics', 'create'), upload.single('proofOfDelivery'), createDelivery);
router.patch('/:id/status', requirePermission('logistics', 'edit'), upload.single('proofOfDelivery'), updateDeliveryStatus);

module.exports = router;
