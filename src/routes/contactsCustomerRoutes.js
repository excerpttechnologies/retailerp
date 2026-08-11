const express = require('express');
const { getContacts } = require('../controllers/contactsSupplierController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/').get(requirePermission('contacts', 'view'), (req, res) => {
  req.params.type = 'customer';
  return getContacts(req, res);
});

module.exports = router;
