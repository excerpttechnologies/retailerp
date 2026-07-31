const asyncHandler = require('express-async-handler');
const Campaign = require('../models/Campaign');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const createCampaign = asyncHandler(async (req, res) => {
  const { name, channel, audienceSegment, message, scheduledDate } = req.body;
  if (!name || !channel) {
    res.status(400);
    throw new Error('name and channel are required');
  }
  const campaign = await Campaign.create({
    company: scopeCompany(req), name, channel, audienceSegment, message,
    scheduledDate, status: scheduledDate ? 'scheduled' : 'draft', createdBy: req.user._id,
  });
  res.status(201).json({ success: true, campaign });
});

const getCampaigns = asyncHandler(async (req, res) => {
  const { search, status, channel, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (status) query.status = status;
  if (channel) query.channel = channel;
  if (search) query.name = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Campaign.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Campaign.countDocuments(query),
  ]);
  res.json({ success: true, data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
});

const updateCampaignStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const campaign = await Campaign.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }
  campaign.status = status;
  await campaign.save();
  res.json({ success: true, campaign });
});

module.exports = { createCampaign, getCampaigns, updateCampaignStatus };
