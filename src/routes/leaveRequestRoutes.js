const express = require('express');
const { createLeaveRequest, getLeaveRequests, decideLeaveRequest } = require('../controllers/leaveRequestController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(requirePermission('hrms', 'view'), getLeaveRequests)
  .post(requirePermission('hrms', 'create'), createLeaveRequest);
router.patch('/:id/decide', requirePermission('hrms', 'approve'), decideLeaveRequest);

module.exports = router;
