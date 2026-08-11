const express = require('express');
const {
  createProduct, getProducts, getProductById, updateProduct, deleteProduct, bulkUpdatePrices,
} = require('../controllers/productController');
const { protect, requirePermission } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const upload = makeUploader('products');
router.use(protect);

router.route('/')
  .get(requirePermission('products', 'view'), getProducts)
  .post(requirePermission('products', 'create'), upload.array('images', 6), createProduct);
router.route('/bulk-update-prices')
  .post(requirePermission('products', 'edit'), bulkUpdatePrices);

router.route('/:id')
  .get(requirePermission('products', 'view'), getProductById)
  .put(requirePermission('products', 'edit'), upload.array('images', 6), updateProduct)
  .delete(requirePermission('products', 'delete'), deleteProduct);

module.exports = router;
