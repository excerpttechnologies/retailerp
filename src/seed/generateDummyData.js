/**
 * generateDummyData.js
 * --------------------
 * Generates realistic dummy data for all ERP modules based on the Temple Fabrics pattern.
 * Creates 15-20 records per module with proper relationships and realistic values.
 * 
 * Usage: node src/seed/generateDummyData.js
 */

require('dotenv').config();
const connectDB = require('../config/db');
const Company = require('../models/Company');
const User = require('../models/User');
const MasterRecord = require('../models/MasterRecord');

// Indian cities, states, pincodes for realistic addresses
const INDIAN_CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  { city: 'Delhi', state: 'Delhi', pincode: '110001' },
  { city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
  { city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
  { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
  { city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
  { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
  { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
  { city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
  { city: 'Surat', state: 'Gujarat', pincode: '395001' },
];

const BUSINESS_NAMES = [
  'Elite Textiles', 'Premium Fabrics Co', 'Royal Silk Emporium',
  'Modern Fashions Ltd', 'Classic Garments', 'Sunrise Textiles',
  'Golden Thread Industries', 'Heritage Fabrics', 'Dream Weavers',
  'Fashion Hub Ltd', 'Textile Mart', 'Style Crafters', 'Silk Route Traders',
  'Fabric Factory Outlet', 'Trendy Textiles', 'Quality Fabrics Inc'
];

const SUPPLIER_NAMES = [
  'Weave Masters Pvt Ltd', 'Cotton Kingdom', 'Silk Valley Exports',
  'Thread & Fabric Co', 'Textile Suppliers India', 'Fabric World Ltd',
  'Prime Textiles', 'Metro Fabrics', 'Global Weavers', 'Cloth Merchants Ltd'
];

const CUSTOMER_NAMES = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy',
  'Vikram Singh', 'Anjali Mehta', 'Rahul Verma', 'Kavita Joshi',
  'Suresh Nair', 'Deepa Iyer', 'Manoj Gupta', 'Pooja Kapoor',
  'Arjun Desai', 'Neha Kulkarni', 'Sanjay Pillai', 'Ritu Agarwal'
];

const AGENT_NAMES = [
  'Arun Textiles Agent', 'Bharat Sales Corp', 'Chandra Marketing',
  'Dinesh Brokers', 'Eshwar Traders', 'Ganesh Associates'
];

const ITEM_PREFIXES = ['SF', 'CT', 'SLK', 'WL', 'PLY', 'JQD', 'EMB', 'PRT'];
const FABRIC_TYPES = [
  'Silk Saree', 'Cotton Fabric', 'Polyester Blend', 'Wool Fabric',
  'Linen Cloth', 'Jacquard Fabric', 'Embroidered Silk', 'Printed Cotton',
  'Designer Saree', 'Plain Fabric', 'Banarasi Silk', 'Kanjivaram Saree'
];

const UOM_LIST = [
  { name: 'Meter', shortName: 'Mtr', allowDecimal: 'Yes', defaultValue: '1' },
  { name: 'Piece', shortName: 'Pcs', allowDecimal: 'No', defaultValue: '1' },
  { name: 'Kilogram', shortName: 'Kg', allowDecimal: 'Yes', defaultValue: '1' },
  { name: 'Set', shortName: 'Set', allowDecimal: 'No', defaultValue: '1' },
  { name: 'Roll', shortName: 'Roll', allowDecimal: 'No', defaultValue: '1' }
];

const ITEM_GROUPS = [
  'Silk Fabrics', 'Cotton Materials', 'Synthetic Fabrics', 'Wool Materials',
  'Linen Products', 'Designer Wear', 'Embroidered Items', 'Plain Fabrics'
];

// Helper functions
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDecimal = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

const generateGSTNumber = (stateCode) => {
  const pan = `${randomInt(10, 99)}AAA${String.fromCharCode(65 + randomInt(0, 25))}A${randomInt(1000, 9999)}A`;
  return `${stateCode}${pan}1Z${randomInt(0, 9)}`;
};

const generateMobile = () => `${randomInt(6, 9)}${randomInt(100000000, 999999999)}`;

const generateEmail = (name) => {
  const domain = randomElement(['gmail.com', 'yahoo.com', 'outlook.com', 'business.in']);
  return `${name.toLowerCase().replace(/\s+/g, '.')}@${domain}`;
};

// Generate data for each module
const generateBusinessMasters = (count = 15) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const location = randomElement(INDIAN_CITIES);
    const businessName = i < BUSINESS_NAMES.length ? BUSINESS_NAMES[i] : `${randomElement(BUSINESS_NAMES)} ${i + 1}`;
    records.push({
      moduleKey: 'settings/setting/business',
      fields: {
        businessName,
        zipCode: location.pincode,
        state: location.state,
        city: location.city,
        isActive: randomElement(['Active', 'Active', 'Active', 'Inactive']) // 75% active
      },
      status: 'active'
    });
  }
  return records;
};

const generateCompanyLocations = (count = 18) => {
  const records = [];
  const locationTypes = ['Main Office', 'Warehouse', 'Showroom', 'Branch', 'Godown'];
  for (let i = 0; i < count; i++) {
    const location = randomElement(INDIAN_CITIES);
    const business = randomElement(BUSINESS_NAMES);
    records.push({
      moduleKey: 'settings/setting/companylocations',
      fields: {
        name: `${business} ${randomElement(locationTypes)} ${i + 1}`,
        landmark: randomElement(['Near Mall', 'Market Street', 'Industrial Area', 'Main Road', '']),
        zipCode: location.pincode,
        state: location.state,
        city: location.city,
        business
      },
      status: 'active'
    });
  }
  return records;
};

const generateLedgerGroups = (count = 20) => {
  const groups = [
    { name: 'Assets', parent: '' },
    { name: 'Bank Accounts', parent: 'Assets' },
    { name: 'Cash Accounts', parent: 'Assets' },
    { name: 'Current Assets', parent: 'Assets' },
    { name: 'Fixed Assets', parent: 'Assets' },
    { name: 'Liabilities', parent: '' },
    { name: 'Current Liabilities', parent: 'Liabilities' },
    { name: 'Long Term Liabilities', parent: 'Liabilities' },
    { name: 'Duties & Taxes', parent: 'Liabilities' },
    { name: 'Sundry Creditors', parent: 'Current Liabilities' },
    { name: 'Sundry Debtors', parent: 'Current Assets' },
    { name: 'Income', parent: '' },
    { name: 'Sales Accounts', parent: 'Income' },
    { name: 'Direct Income', parent: 'Income' },
    { name: 'Expenses', parent: '' },
    { name: 'Direct Expenses', parent: 'Expenses' },
    { name: 'Indirect Expenses', parent: 'Expenses' },
    { name: 'Purchase Accounts', parent: 'Expenses' },
    { name: 'Loans & Advances', parent: 'Assets' },
    { name: 'Provisions', parent: 'Liabilities' }
  ];
  
  return groups.map(g => ({
    moduleKey: 'settings/setting/ledgergroups',
    fields: { name: g.name, parent: g.parent, isActive: 'Active' },
    status: 'active'
  }));
};

const generateLedger = (count = 20) => {
  const records = [];
  const groups = ['Sundry Debtors', 'Sundry Creditors', 'Bank Accounts', 'Cash Accounts'];
  for (let i = 0; i < count; i++) {
    const group = randomElement(groups);
    const name = group.includes('Debtor') || group.includes('Creditor')
      ? `${randomElement([...SUPPLIER_NAMES, ...CUSTOMER_NAMES])} A/C`
      : `${group} - ${i + 1}`;
    
    records.push({
      moduleKey: 'settings/setting/ledger',
      fields: {
        name,
        group,
        isActive: 'Active',
        default: randomElement(['Yes', 'No', 'No', 'No']),
        balance: randomDecimal(0, 100000),
        openingBalance: randomDecimal(0, 50000)
      },
      status: 'active'
    });
  }
  return records;
};

const generateTaxMaster = (count = 6) => {
  const taxes = [
    { taxName: 'GST 0%', igst: '0', cgst: '0', sgst: '0', cess: '0' },
    { taxName: 'GST 3%', igst: '3', cgst: '1.5', sgst: '1.5', cess: '0' },
    { taxName: 'GST 5%', igst: '5', cgst: '2.5', sgst: '2.5', cess: '0' },
    { taxName: 'GST 12%', igst: '12', cgst: '6', sgst: '6', cess: '0' },
    { taxName: 'GST 18%', igst: '18', cgst: '9', sgst: '9', cess: '0' },
    { taxName: 'GST 28%', igst: '28', cgst: '14', sgst: '14', cess: '0' }
  ];
  
  return taxes.map(t => ({
    moduleKey: 'settings/setting/tax',
    fields: { ...t, status: 'Active' },
    status: 'active'
  }));
};

const generateHSNMaster = (count = 15) => {
  const hsnCodes = ['5007', '5208', '5407', '5512', '5801', '5806', '5809', '6001', 
                    '6002', '6006', '6101', '6201', '6302', '6402', '6403'];
  
  return hsnCodes.slice(0, count).map(code => ({
    moduleKey: 'settings/setting/hsn',
    fields: {
      code,
      effectiveDate: `01-04-${randomInt(2024, 2026)}`,
      status: 'Active'
    },
    status: 'active'
  }));
};

const generatePurchaseGroups = (count = 15) => {
  const groups = ['SILK', 'COTTON', 'POLYESTER', 'WOOL', 'LINEN', 'GENERAL', 
                  'PREMIUM', 'ECONOMY', 'DESIGNER', 'EMBROIDERED', 'PRINTED', 
                  'PLAIN', 'BANARASI', 'KANJIVARAM', 'ZARI'];
  
  return groups.slice(0, count).map(g => ({
    moduleKey: 'settings/setting/purchasegroup',
    fields: {
      groupName: g,
      business: randomElement(BUSINESS_NAMES),
      status: 'Active'
    },
    status: 'active'
  }));
};

const generateGoodsTypes = (count = 15) => {
  const goodsTypes = ['Finished Goods', 'Raw Material', 'Semi-Finished', 'Accessories', 
                      'Packing Material', 'Trading Goods', 'Services', 'Consumables',
                      'Readymade', 'Fabric Rolls', 'Designer Wear', 'Embellishments'];
  
  return goodsTypes.slice(0, count).map(g => ({
    moduleKey: 'settings/setting/goodstype',
    fields: {
      goodsName: g,
      business: randomElement(BUSINESS_NAMES),
      status: 'Active'
    },
    status: 'active'
  }));
};

const generateDocSetup = (count = 15) => {
  const docTypes = [
    { name: 'PI', type: 'Purchase Invoice', prefix: 'PI/[YY]/', validity: 'Yearly' },
    { name: 'SI', type: 'Sales Invoice', prefix: 'SI/[YY]/', validity: 'Yearly' },
    { name: 'DC', type: 'Delivery Challan', prefix: 'DC/[YY]/', validity: 'Yearly' },
    { name: 'GRC', type: 'GRC', prefix: 'GRC/[YY]/', validity: 'Yearly' },
    { name: 'PO', type: 'Purchase Order', prefix: 'PO/[YY]/', validity: 'Yearly' },
    { name: 'SO', type: 'Sales Order', prefix: 'SO/[YY]/', validity: 'Yearly' },
    { name: 'DN', type: 'Debit Note', prefix: 'DN/[YY]/', validity: 'Yearly' },
    { name: 'CN', type: 'Credit Note', prefix: 'CN/[YY]/', validity: 'Yearly' },
    { name: 'SR', type: 'Sales Return', prefix: 'SR/[YY]/', validity: 'Yearly' },
    { name: 'PR', type: 'Purchase Return', prefix: 'PR/[YY]/', validity: 'Yearly' },
    { name: 'STK', type: 'Stock Adjustment', prefix: 'STK/[YY]/', validity: 'Never' },
    { name: 'JV', type: 'Journal Voucher', prefix: 'JV/[YY]/', validity: 'Yearly' },
    { name: 'PV', type: 'Payment Voucher', prefix: 'PV/[YY]/', validity: 'Yearly' },
    { name: 'RV', type: 'Receipt Voucher', prefix: 'RV/[YY]/', validity: 'Yearly' },
    { name: 'CV', type: 'Contra Voucher', prefix: 'CV/[YY]/', validity: 'Yearly' }
  ];
  
  return docTypes.slice(0, count).map(d => ({
    moduleKey: 'settings/setting/docsetup',
    fields: {
      name: d.name,
      type: d.type,
      prefix: d.prefix,
      suffix: '',
      startFrom: String(randomInt(1, 100)),
      validity: d.validity,
      finYear: '2026-2027'
    },
    status: 'active'
  }));
};

const generateUOM = () => {
  return UOM_LIST.map(u => ({
    moduleKey: 'inventory/inventory/uom',
    fields: {
      name: u.name,
      shortName: u.shortName,
      allowDecimal: u.allowDecimal,
      defaultValue: u.defaultValue,
      business: randomElement(BUSINESS_NAMES)
    },
    status: 'active'
  }));
};

const generateProductGroups = (count = 15) => {
  return ITEM_GROUPS.slice(0, count).map((group, i) => ({
    moduleKey: 'inventory/inventory/product/group',
    fields: {
      name: group,
      business: randomElement(BUSINESS_NAMES),
      prefix: ITEM_PREFIXES[i % ITEM_PREFIXES.length],
      parent: i > 7 ? ITEM_GROUPS[i % 8] : ''
    },
    status: 'active'
  }));
};

const generateCategories = (count = 15) => {
  const categories = ['Sarees', 'Fabrics', 'Dress Materials', 'Blouses', 'Dupattas',
                      'Silk', 'Cotton', 'Synthetic', 'Designer', 'Embroidered',
                      'Printed', 'Plain', 'Wedding Collection', 'Party Wear', 'Casual'];
  
  return categories.slice(0, count).map((cat, i) => ({
    moduleKey: 'inventory/inventory/category',
    fields: {
      name: cat,
      shortName: cat.substring(0, 3).toUpperCase(),
      shortCode: `CAT${(i + 1).toString().padStart(3, '0')}`,
      status: 'Active',
      parent: i > 7 ? categories[i % 8] : ''
    },
    status: 'active'
  }));
};

const generateItems = (count = 20) => {
  const records = [];
  const hsnCodes = ['5007', '5208', '5407', '5512', '5801'];
  
  for (let i = 0; i < count; i++) {
    const fabricType = randomElement(FABRIC_TYPES);
    const prefix = randomElement(ITEM_PREFIXES);
    const itemCode = `${prefix}${(i + 1001).toString()}`;
    
    records.push({
      moduleKey: 'inventory/inventory/item',
      fields: {
        name: `${fabricType} ${i + 1}`,
        itemType: randomElement(['Finished', 'Raw', 'Trading']),
        hsnCode: randomElement(hsnCodes),
        uom: randomElement(['Meter', 'Piece', 'Roll']),
        prefix,
        itemCode,
        group: randomElement(ITEM_GROUPS),
        subGroup: randomElement(ITEM_GROUPS)
      },
      status: 'active'
    });
  }
  return records;
};

const generateSuppliers = (count = 18) => {
  const records = [];
  
  for (let i = 0; i < count; i++) {
    const supplierName = i < SUPPLIER_NAMES.length ? SUPPLIER_NAMES[i] : `${randomElement(SUPPLIER_NAMES)} ${i}`;
    const location = randomElement(INDIAN_CITIES);
    const contactId = `SUP${(i + 1).toString().padStart(4, '0')}`;
    const mobile = generateMobile();
    
    records.push({
      moduleKey: 'contacts/contact/supplier',
      fields: {
        businessName: supplierName,
        contactId,
        name: supplierName,
        mobile,
        email: generateEmail(supplierName),
        address: `${location.city}, ${location.state} - ${location.pincode}`
      },
      status: 'active'
    });
  }
  return records;
};

const generateCustomers = (count = 20) => {
  const records = [];
  
  for (let i = 0; i < count; i++) {
    const customerName = i < CUSTOMER_NAMES.length ? CUSTOMER_NAMES[i] : `Customer ${i + 1}`;
    const location = randomElement(INDIAN_CITIES);
    const contactId = `CUST${(i + 1).toString().padStart(4, '0')}`;
    const mobile = generateMobile();
    
    records.push({
      moduleKey: 'contacts/contact/customer',
      fields: {
        name: customerName,
        contactId,
        name2: customerName,
        mobile,
        email: generateEmail(customerName),
        address: `${location.city}, ${location.state} - ${location.pincode}`
      },
      status: 'active'
    });
  }
  return records;
};

const generateAgents = (count = 6) => {
  return AGENT_NAMES.slice(0, count).map((agent, i) => ({
    moduleKey: 'contacts/contact/agent',
    fields: {
      name: agent,
      contactId: `AGT${(i + 1).toString().padStart(4, '0')}`,
      mobile: generateMobile(),
      email: generateEmail(agent),
      address: `${randomElement(INDIAN_CITIES).city}`
    },
    status: 'active'
  }));
};

const generateGRCs = (count = 15) => {
  const records = [];
  
  for (let i = 0; i < count; i++) {
    const grcNo = `GRC/26/${(i + 1001).toString()}`;
    const grcDate = `${randomInt(1, 28).toString().padStart(2, '0')}-${randomInt(1, 12).toString().padStart(2, '0')}-2026`;
    
    records.push({
      moduleKey: 'purchase/transaction/purchase/grc',
      fields: {
        vendorName: randomElement(SUPPLIER_NAMES),
        grcNo,
        grcDate,
        logisticNo: `LOG${randomInt(1000, 9999)}`,
        purchaseGroup: randomElement(['SILK', 'COTTON', 'GENERAL']),
        occasion: randomElement(['Regular', 'Festival', 'Wedding', 'Seasonal']),
        agent: randomElement(AGENT_NAMES),
        vendorDocNo: `VD${randomInt(100, 999)}`,
        procurementType: randomElement(['Local', 'Interstate', 'Import']),
        purchaseTerm: randomElement(['Credit', 'Cash', 'Advance']),
        taxable: randomDecimal(10000, 100000),
        totalQuantity: String(randomInt(10, 500)),
        gst: randomDecimal(1000, 10000),
        netAmount: randomDecimal(15000, 150000)
      },
      status: 'active'
    });
  }
  return records;
};

const generatePurchaseInvoices = (count = 15) => {
  const records = [];
  
  for (let i = 0; i < count; i++) {
    const piNo = `PI/26/${(i + 1001).toString()}`;
    const piDate = `${randomInt(1, 28).toString().padStart(2, '0')}-${randomInt(1, 12).toString().padStart(2, '0')}-2026`;
    const grcNo = `GRC/26/${randomInt(1001, 1050)}`;
    
    records.push({
      moduleKey: 'purchase/transaction/purchase/invoice',
      fields: {
        purchaseInvoice: piNo,
        purchaseDate: piDate,
        supplierName: randomElement(SUPPLIER_NAMES),
        grcNo,
        netPurchaseAmt: randomDecimal(50000, 200000),
        totalPayable: randomDecimal(55000, 220000)
      },
      status: 'active'
    });
  }
  return records;
};

const generateDeliveryChallans = (count = 15) => {
  const records = [];
  
  for (let i = 0; i < count; i++) {
    const dcNo = `DC/26/${(i + 2001).toString()}`;
    const dcDate = `${randomInt(1, 28).toString().padStart(2, '0')}-${randomInt(1, 12).toString().padStart(2, '0')}-2026`;
    const location = randomElement(INDIAN_CITIES);
    
    records.push({
      moduleKey: 'sell/transaction/sell/deliverychallan',
      fields: {
        deliveryChallanNo: dcNo,
        customerName: randomElement(CUSTOMER_NAMES),
        customerMobile: generateMobile(),
        customerGstNo: generateGSTNumber(location.state.substring(0, 2).toUpperCase()),
        createdOn: dcDate,
        logisticNo: `LOG${randomInt(2000, 9999)}`
      },
      status: 'active'
    });
  }
  return records;
};

const generateSalesInvoices = (count = 18) => {
  const records = [];
  
  for (let i = 0; i < count; i++) {
    const siNo = `SI/26/${(i + 3001).toString()}`;
    const siDate = `${randomInt(1, 28).toString().padStart(2, '0')}-${randomInt(1, 12).toString().padStart(2, '0')}-2026`;
    const dcNo = `DC/26/${randomInt(2001, 2050)}`;
    const location = randomElement(INDIAN_CITIES);
    
    records.push({
      moduleKey: 'sell/transaction/sell/salesinvoice',
      fields: {
        salesInvoiceNo: siNo,
        customerName: randomElement(CUSTOMER_NAMES),
        customerMobile: generateMobile(),
        customerGstNo: generateGSTNumber(location.state.substring(0, 2).toUpperCase()),
        deliveryChallanNo: dcNo,
        createdOn: siDate
      },
      status: 'active'
    });
  }
  return records;
};

// Main function
const main = async () => {
  await connectDB();
  
  // Get Temple Fabrics company
  const company = await Company.findOne({ code: 'TEMPFAB' });
  if (!company) {
    console.error('[GenerateDummy] Temple Fabrics company not found. Run seedStructuredData.js first.');
    process.exit(1);
  }
  
  console.log(`[GenerateDummy] Generating dummy data for company: ${company.name}`);
  
  const allRecords = [
    ...generateBusinessMasters(15),
    ...generateCompanyLocations(18),
    ...generateLedgerGroups(20),
    ...generateLedger(20),
    ...generateTaxMaster(6),
    ...generateHSNMaster(15),
    ...generatePurchaseGroups(15),
    ...generateGoodsTypes(15),
    ...generateDocSetup(15),
    ...generateUOM(),
    ...generateProductGroups(15),
    ...generateCategories(15),
    ...generateItems(20),
    ...generateSuppliers(18),
    ...generateCustomers(20),
    ...generateAgents(6),
    ...generateGRCs(15),
    ...generatePurchaseInvoices(15),
    ...generateDeliveryChallans(15),
    ...generateSalesInvoices(18)
  ];
  
  // Add company reference to all records
  const recordsWithCompany = allRecords.map(r => ({
    ...r,
    company: company._id
  }));
  
  console.log(`[GenerateDummy] Inserting ${recordsWithCompany.length} dummy records...`);
  
  // Insert all records
  await MasterRecord.insertMany(recordsWithCompany);
  
  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log(`[GenerateDummy] Done! Created ${recordsWithCompany.length} dummy records`);
  console.log('══════════════════════════════════════════════════');
  console.log('');
  console.log('Summary by module:');
  console.log('  • Business Masters: 15 records');
  console.log('  • Company Locations: 18 records');
  console.log('  • Ledger Groups: 20 records');
  console.log('  • Ledger: 20 records');
  console.log('  • Tax Master: 6 records');
  console.log('  • HSN Master: 15 records');
  console.log('  • Purchase Groups: 15 records');
  console.log('  • Goods Types: 15 records');
  console.log('  • Doc Setup: 15 records');
  console.log('  • UOM: 5 records');
  console.log('  • Product Groups: 15 records');
  console.log('  • Categories: 15 records');
  console.log('  • Items: 20 records');
  console.log('  • Suppliers: 18 records');
  console.log('  • Customers: 20 records');
  console.log('  • Agents: 6 records');
  console.log('  • GRCs: 15 records');
  console.log('  • Purchase Invoices: 15 records');
  console.log('  • Delivery Challans: 15 records');
  console.log('  • Sales Invoices: 18 records');
  console.log('');
  
  process.exit(0);
};

main().catch((err) => {
  console.error('[GenerateDummy] Fatal error:', err);
  process.exit(1);
});
