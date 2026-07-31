const express = require('express');
const {
  createAttendance,
  listAttendance,
  getAttendance,
  updateAttendance,
  removeAttendance,
  employeeSummary,
  monthSummary,
  upsertOverride,
} = require('../controllers/attendanceController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(requirePermission('hrms', 'view'), listAttendance)
  .post(requirePermission('hrms', 'create'), createAttendance);

router.get('/summary/employee', requirePermission('hrms', 'view'), employeeSummary);
router.get('/summary/month', requirePermission('hrms', 'view'), monthSummary);
router.post('/override', requirePermission('hrms', 'edit'), upsertOverride);

router.route('/:id')
  .get(requirePermission('hrms', 'view'), getAttendance)
  .patch(requirePermission('hrms', 'edit'), updateAttendance)
  .delete(requirePermission('hrms', 'delete'), removeAttendance);

module.exports = router;
