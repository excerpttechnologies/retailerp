const express = require('express');
const { createCampaign, getCampaigns, updateCampaignStatus } = require('../controllers/campaignController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(requirePermission('marketing', 'view'), getCampaigns)
  .post(requirePermission('marketing', 'create'), createCampaign);
router.patch('/:id/status', requirePermission('marketing', 'edit'), updateCampaignStatus);

module.exports = router;
