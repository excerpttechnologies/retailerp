const express = require('express');
const {
  createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer,
} = require('../controllers/customerController');
const { protect, requirePermission } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const upload = makeUploader('customers');
router.use(protect);

router.route('/')
  .get(requirePermission('customers', 'view'), getCustomers)
  .post(requirePermission('customers', 'create'), upload.array('documents', 5), createCustomer);
router.route('/:id')
  .get(requirePermission('customers', 'view'), getCustomerById)
  .put(requirePermission('customers', 'edit'), upload.array('documents', 5), updateCustomer)
  .delete(requirePermission('customers', 'delete'), deleteCustomer);

module.exports = router;
