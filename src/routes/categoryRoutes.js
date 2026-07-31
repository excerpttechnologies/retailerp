const express = require('express');
const {
  createCategory, getCategories, getCategoryById, updateCategory, deleteCategory,
} = require('../controllers/categoryController');
const { protect, requirePermission } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const upload = makeUploader('products', /jpeg|jpg|png|webp/);
router.use(protect);

router.route('/')
  .get(requirePermission('categories', 'view'), getCategories)
  .post(requirePermission('categories', 'create'), upload.single('image'), createCategory);
router.route('/:id')
  .get(requirePermission('categories', 'view'), getCategoryById)
  .put(requirePermission('categories', 'edit'), upload.single('image'), updateCategory)
  .delete(requirePermission('categories', 'delete'), deleteCategory);

module.exports = router;
