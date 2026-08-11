const mongoose = require('mongoose');

// Create a separate connection for the barcode database
let barcodeConnection = null;
let BarcodeModel = null;

const getBarcodeConnection = async () => {
  if (!barcodeConnection) {
    const barcodeUri = 'mongodb+srv://myexcerpt4_db_user:3BXkuXtCkezZw3DN@cluster0.esgm9dw.mongodb.net/barcode_db';
    barcodeConnection = await mongoose.createConnection(barcodeUri).asPromise();
    console.log('✓ Connected to barcode_db');
    
    // Define schema and model
    const barcodeSchema = new mongoose.Schema({
      _row_index: Number,
      item_key: String,
      branch: String,
      CP: String,
      DP: String,
      Group: String,
      HSH: String,
      Img: String,
      'Item Code': String,
      'Item Name': String,
      RSP: String,
      Stock: String,
      'Sub Group': String,
      Supplier: String,
      WSP: String,
      image_url: String,
      _scraped_at: String,
    }, { collection: 'barcodes', strict: false });
    
    BarcodeModel = barcodeConnection.model('Barcode', barcodeSchema);
  }
  return { connection: barcodeConnection, model: BarcodeModel };
};

// GET /api/barcodes - List barcodes with filters
exports.getBarcodes = async (req, res) => {
  try {
    const { model } = await getBarcodeConnection();
    
    const { branch, group, subgroup, itemCode, supplier, page = 1, limit = 25 } = req.query;
    
    // Build filter query
    const filter = {};
    if (branch) filter.branch = new RegExp(branch, 'i');
    if (group) filter.Group = new RegExp(group, 'i');
    if (subgroup) filter['Sub Group'] = new RegExp(subgroup, 'i');
    if (itemCode) filter['Item Code'] = new RegExp(itemCode, 'i');
    if (supplier) filter.Supplier = new RegExp(supplier, 'i');
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [data, total] = await Promise.all([
      model.find(filter)
        .sort({ _row_index: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      model.countDocuments(filter)
    ]);
    
    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching barcodes:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/barcodes/branches - Get distinct branches
exports.getBranches = async (req, res) => {
  try {
    const { model } = await getBarcodeConnection();
    
    const branches = await model.distinct('branch');
    
    res.json({
      success: true,
      data: branches.filter(b => b).sort()
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/barcodes/groups - Get distinct groups
exports.getGroups = async (req, res) => {
  try {
    const { model } = await getBarcodeConnection();
    const { branch } = req.query;
    
    const filter = {};
    if (branch) filter.branch = branch;
    
    const groups = await model.distinct('Group', filter);
    
    res.json({
      success: true,
      data: groups.filter(g => g).sort()
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/barcodes/subgroups - Get distinct subgroups
exports.getSubgroups = async (req, res) => {
  try {
    const { model } = await getBarcodeConnection();
    const { branch, group } = req.query;
    
    const filter = {};
    if (branch) filter.branch = branch;
    if (group) filter.Group = group;
    
    const subgroups = await model.distinct('Sub Group', filter);
    
    res.json({
      success: true,
      data: subgroups.filter(sg => sg).sort()
    });
  } catch (error) {
    console.error('Error fetching subgroups:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/barcodes/:id - Get single barcode by ID
exports.getBarcodeById = async (req, res) => {
  try {
    const { model } = await getBarcodeConnection();
    const { id } = req.params;
    
    const barcode = await model.findById(id).lean();
    
    if (!barcode) {
      return res.status(404).json({ success: false, message: 'Barcode not found' });
    }
    
    res.json({
      success: true,
      data: barcode
    });
  } catch (error) {
    console.error('Error fetching barcode:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
