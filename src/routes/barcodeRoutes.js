const express = require('express');
const router = express.Router();
const barcodeController = require('../controllers/barcodeController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// GET /api/barcodes - List barcodes with filters
router.get('/', barcodeController.getBarcodes);

// GET /api/barcodes/branches - Get distinct branches
router.get('/branches', barcodeController.getBranches);

// GET /api/barcodes/groups - Get distinct groups (with optional branch filter)
router.get('/groups', barcodeController.getGroups);

// GET /api/barcodes/subgroups - Get distinct subgroups (with optional branch/group filter)
router.get('/subgroups', barcodeController.getSubgroups);

// GET /api/barcodes/:id - Get single barcode by ID
router.get('/:id', barcodeController.getBarcodeById);

module.exports = router;
