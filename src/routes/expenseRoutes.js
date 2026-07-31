const express = require('express');
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect, requirePermission } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const upload = makeUploader('documents');
router.use(protect);

router.route('/')
  .get(requirePermission('finance', 'view'), getExpenses)
  .post(requirePermission('finance', 'create'), upload.single('attachment'), createExpense);
router.route('/:id')
  .put(requirePermission('finance', 'edit'), upload.single('attachment'), updateExpense)
  .delete(requirePermission('finance', 'delete'), deleteExpense);

module.exports = router;
