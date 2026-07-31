const express = require('express');
const { createTicket, getTickets, updateTicketStatus } = require('../controllers/serviceTicketController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(requirePermission('service', 'view'), getTickets)
  .post(requirePermission('service', 'create'), createTicket);
router.put('/:id', requirePermission('service', 'edit'), updateTicketStatus);

module.exports = router;
