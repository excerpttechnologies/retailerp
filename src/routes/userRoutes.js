const express = require('express');
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(requirePermission('users', 'view'), getUsers)
  .post(requirePermission('users', 'create'), createUser);
router.route('/:id')
  .put(requirePermission('users', 'edit'), updateUser)
  .delete(requirePermission('users', 'delete'), deleteUser);

module.exports = router;
