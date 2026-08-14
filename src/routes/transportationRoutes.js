const express = require('express');
const {
  getTransportationList,
  getTransportationById,
  createTransportation,
  updateTransportation,
  deleteTransportation,
  getTransportationStats,
  updateTransportationStatus,
} = require('../controllers/transportationController');
const { protect, requirePermission } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const upload = makeUploader('documents');

// Apply authentication to all routes
router.use(protect);

/**
 * @route GET /api/transportation
 * @route POST /api/transportation
 */
router
  .route('/')
  .get(requirePermission('logistics', 'view'), getTransportationList)
  .post(requirePermission('logistics', 'create'), upload.single('proofOfDelivery'), createTransportation);

/**
 * @route GET /api/transportation/stats/summary
 */
router.get('/stats/summary', requirePermission('logistics', 'view'), getTransportationStats);

/**
 * @route GET /api/transportation/:id
 * @route PUT /api/transportation/:id
 * @route DELETE /api/transportation/:id
 */
router
  .route('/:id')
  .get(requirePermission('logistics', 'view'), getTransportationById)
  .put(requirePermission('logistics', 'edit'), upload.single('proofOfDelivery'), updateTransportation)
  .delete(requirePermission('logistics', 'delete'), deleteTransportation);

/**
 * @route PATCH /api/transportation/:id/status
 */
router.patch('/:id/status', requirePermission('logistics', 'edit'), updateTransportationStatus);

module.exports = router;
