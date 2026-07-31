const express = require('express');
const {
  getPermissionMeta, createRole, getRoles, getRoleById, updateRole, deleteRole,
} = require('../controllers/roleController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/meta', getPermissionMeta);
router.route('/').get(getRoles).post(createRole);
router.route('/:id').get(getRoleById).put(updateRole).delete(deleteRole);

module.exports = router;
