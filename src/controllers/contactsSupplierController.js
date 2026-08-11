const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// ─── Lazy barcode_db connection ────────────────────────────────────────────────
// Re-uses the same Atlas cluster as the main connection (MONGO_URI) but
// explicitly targets the barcode_db database.
let _barcodeConn = null;

const getBarcodeDb = async () => {
  if (_barcodeConn && _barcodeConn.readyState === 1) return _barcodeConn;

  // Build the barcode_db URI from the existing MONGO_URI env var.
  // MONGO_URI may end with "/" (no db name) or with "/<dbname>" — handle both.
  const baseUri = (process.env.MONGO_URI || '').replace(/\/[^/?]*(\?|$)/, '/$1').replace(/\/$/, '');
  const barcodeUri = baseUri
    ? `${baseUri}/barcode_db`
    : 'mongodb://127.0.0.1:27017/barcode_db';

  _barcodeConn = await mongoose.createConnection(barcodeUri, {
    serverSelectionTimeoutMS: 10000,
  }).asPromise();

  console.log(`[BarcodeDB] Connected: ${_barcodeConn.host}/barcode_db`);
  return _barcodeConn;
};

// ─── Schema (strict:false keeps _row_index and any extra fields) ──────────────
const contactSchema = new mongoose.Schema({
  'Contact ID':    String,
  'Business Name': String,
  Name:            String,
  Mobile:          String,
  Email:           String,
  Address:         String,
}, { strict: false });

// Model cache — one per collection name
const _models = {};
const getModel = async (collectionName) => {
  if (_models[collectionName]) return _models[collectionName];
  const conn = await getBarcodeDb();
  // Use a unique model name per connection to avoid OverwriteModelError
  const modelName = `BarcodeContact_${collectionName}`;
  _models[collectionName] = conn.models[modelName]
    || conn.model(modelName, contactSchema, collectionName);
  return _models[collectionName];
};

// ─── Field normalizer ─────────────────────────────────────────────────────────
// Returns BOTH the original MongoDB field names (for the page table columns)
// AND camelCase aliases (for backward compat with older components).
const normalizeDoc = (doc) => ({
  _id:             doc._id,
  // Original casing — used by SuppliersPage / CustomersPage column definitions
  'Contact ID':    doc['Contact ID']    || '',
  'Business Name': doc['Business Name'] || '',
  'Name':          doc.Name             || '',
  'Mobile':        doc.Mobile           || '',
  'Email':         doc.Email            || '',
  'Address':       doc.Address          || '',
  '_row_index':    doc._row_index       ?? null,
  // camelCase aliases for any other components
  contactId:    doc['Contact ID']    || '',
  businessName: doc['Business Name'] || '',
  name:         doc.Name             || '',
  mobile:       doc.Mobile           || '',
  email:        doc.Email            || '',
  address:      doc.Address          || '',
});

// ─── Controller ───────────────────────────────────────────────────────────────
const getContacts = asyncHandler(async (req, res) => {
  // type is set by the route handler: 'supplier' | 'customer'
  const collectionName = req.params.type === 'supplier' ? 'suppliers' : 'customers';
  const Model = await getModel(collectionName);

  const { search = '', page = 1, limit = 10 } = req.query;
  const pageNumber = Math.max(1, parseInt(page, 10));
  const pageSize   = Math.min(200, Math.max(1, parseInt(limit, 10))); // cap at 200
  const skip       = (pageNumber - 1) * pageSize;

  // Build search filter
  const filter = {};
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { 'Business Name': regex },
      { 'Contact ID':    regex },
      { Name:            regex },
      { Mobile:          regex },
      { Email:           regex },
    ];
  }

  const [docs, total] = await Promise.all([
    Model.find(filter)
      .sort({ 'Business Name': 1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Model.countDocuments(filter),
  ]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  // Return BOTH shapes so both old and new frontend code works:
  //   Flat:   { data, total, page, limit, pages }
  //   Nested: { data, pagination: { total, page, limit, pages } }
  res.json({
    success: true,
    data:    docs.map(normalizeDoc),
    total,
    page:    pageNumber,
    limit:   pageSize,
    pages,
    pagination: { total, page: pageNumber, limit: pageSize, pages },
  });
});

module.exports = { getContacts };
