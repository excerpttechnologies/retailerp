const express = require('express');
const { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect, requirePermission } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const upload = makeUploader('documents');
router.use(protect);

router.route('/')
  .get(requirePermission('hrms', 'view'), getEmployees)
  .post(requirePermission('hrms', 'create'), upload.array('documents', 5), createEmployee);
router.route('/:id')
  .get(requirePermission('hrms', 'view'), getEmployeeById)
  .put(requirePermission('hrms', 'edit'), upload.array('documents', 5), updateEmployee)
  .delete(requirePermission('hrms', 'delete'), deleteEmployee);

module.exports = router;
