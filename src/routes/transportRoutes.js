const express = require('express');
const {
  getTransportList,
  getTransportById,
  createTransport,
  updateTransport,
  deleteTransport,
  getTransportStats,
} = require('../controllers/transportController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

/**
 * @route GET /api/logistic/delivery
 * @route POST /api/logistic/delivery
 */
router
  .route('/')
  .get(requirePermission('logistics', 'view'), getTransportList)
  .post(requirePermission('logistics', 'create'), createTransport);

/**
 * @route GET /api/logistic/delivery/stats/summary
 */
router.get('/stats/summary', requirePermission('logistics', 'view'), getTransportStats);

/**
 * @route GET /api/logistic/delivery/:id
 * @route PUT /api/logistic/delivery/:id
 * @route DELETE /api/logistic/delivery/:id
 */
router
  .route('/:id')
  .get(requirePermission('logistics', 'view'), getTransportById)
  .put(requirePermission('logistics', 'edit'), updateTransport)
  .delete(requirePermission('logistics', 'delete'), deleteTransport);

module.exports = router;
