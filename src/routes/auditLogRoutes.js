const express = require('express');
const { getAuditLogs } = require('../controllers/auditLogController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.get('/', protect, requirePermission('compliance', 'view'), getAuditLogs);

module.exports = router;
