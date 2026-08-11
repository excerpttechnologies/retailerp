const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

let barcodeContactsConnection = null;
let supplierModel = null;
let customerModel = null;

const getBarcodeConnection = async () => {
  if (barcodeContactsConnection) return barcodeContactsConnection;

  const barcodeUri = 'mongodb+srv://myexcerpt4_db_user:3BXkuXtCkezZw3DN@cluster0.esgm9dw.mongodb.net/barcode_db';
  barcodeContactsConnection = await mongoose.createConnection(barcodeUri).asPromise();
  return barcodeContactsConnection;
};

const getBarcodeModel = async (collectionName) => {
  const connection = await getBarcodeConnection();
  if (collectionName === 'suppliers' && supplierModel) return supplierModel;
  if (collectionName === 'customers' && customerModel) return customerModel;

  const schema = new mongoose.Schema({
    'Contact ID': String,
    'Business Name': String,
    Name: String,
    Mobile: String,
    Email: String,
    Address: String,
  }, { collection: collectionName, strict: false });

  const model = connection.model(`Barcode${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}`, schema);
  if (collectionName === 'suppliers') supplierModel = model;
  if (collectionName === 'customers') customerModel = model;
  return model;
};

const normalizeContactDoc = (doc) => ({
  _id: doc._id,
  businessName: doc.businessName || doc['Business Name'] || '',
  contactId: doc.contactId || doc['Contact ID'] || '',
  name: doc.name || doc.Name || '',
  mobile: doc.mobile || doc.Mobile || '',
  email: doc.email || doc.Email || '',
  address: doc.address || doc.Address || '',
});

const getContacts = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const collectionName = type === 'supplier' ? 'suppliers' : 'customers';
  const Model = await getBarcodeModel(collectionName);
  const { search, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { 'Business Name': regex },
      { Mobile: regex },
      { Email: regex },
      { Name: regex },
      { 'Contact ID': regex },
    ];
  }

  const pageNumber = Math.max(1, Number(page));
  const pageSize = Math.max(1, Number(limit));
  const skip = (pageNumber - 1) * pageSize;

  const [docs, total] = await Promise.all([
    Model.find(filter).sort({ 'Business Name': 1 }).skip(skip).limit(pageSize).lean(),
    Model.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: docs.map(normalizeContactDoc),
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      pages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
});

module.exports = { getContacts };
