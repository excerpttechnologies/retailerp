const express = require('express');
const {
  getRegistry, createRecord, getRecords, getRecordById, updateRecord, deleteRecord,
} = require('../controllers/masterController');
const { protect, requireModulePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/registry', getRegistry);

router.route('/:moduleKey(*)')
  .get(requireModulePermission('view'), getRecords)
  .post(requireModulePermission('create'), createRecord);

router.route('/:moduleKey(*)/:id')
  .get(requireModulePermission('view'), getRecordById)
  .put(requireModulePermission('edit'), updateRecord)
  .delete(requireModulePermission('delete'), deleteRecord);

module.exports = router;
