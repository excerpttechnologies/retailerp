const express = require('express');
const { createDocument, getDocuments, deleteDocument } = require('../controllers/documentController');
const { protect, requirePermission } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const upload = makeUploader('documents');
router.use(protect);

router.route('/')
  .get(requirePermission('documents', 'view'), getDocuments)
  .post(requirePermission('documents', 'create'), upload.single('file'), createDocument);
router.delete('/:id', requirePermission('documents', 'delete'), deleteDocument);

module.exports = router;
