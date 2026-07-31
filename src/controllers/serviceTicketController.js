const asyncHandler = require('express-async-handler');
const ServiceTicket = require('../models/ServiceTicket');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const generateTicketNumber = async (companyId) => {
  const count = await ServiceTicket.countDocuments({ company: companyId });
  return `TKT-${String(count + 1).padStart(5, '0')}`;
};

const createTicket = asyncHandler(async (req, res) => {
  const { customer, product, subject, description, priority } = req.body;
  if (!customer || !subject) {
    res.status(400);
    throw new Error('customer and subject are required');
  }
  const companyId = scopeCompany(req);
  const ticketNumber = await generateTicketNumber(companyId);

  const ticket = await ServiceTicket.create({
    company: companyId, ticketNumber, customer, product, subject, description, priority, createdBy: req.user._id,
  });
  res.status(201).json({ success: true, ticket });
});

const getTickets = asyncHandler(async (req, res) => {
  const { search, status, priority, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) query.subject = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    ServiceTicket.find(query).populate('customer', 'name phone').populate('product', 'name sku').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ServiceTicket.countDocuments(query),
  ]);

  res.json({ success: true, data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
});

const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status, resolutionNotes, assignedTo } = req.body;
  const ticket = await ServiceTicket.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  if (status) ticket.status = status;
  if (resolutionNotes !== undefined) ticket.resolutionNotes = resolutionNotes;
  if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
  await ticket.save();
  res.json({ success: true, ticket });
});

module.exports = { createTicket, getTickets, updateTicketStatus };
