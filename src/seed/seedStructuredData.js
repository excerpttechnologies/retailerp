/**
 * seedStructuredData.js
 * ---------------------
 * Reads public/_structured_data.json and upserts every row into MasterRecord.
 * Fields are remapped from raw display labels ("Business Name") to the camelCase
 * keys used by moduleRegistry.seed.js columns ("businessName") so the frontend
 * table renders correctly via r.fields?.[col.key].
 *
 * Safe to run multiple times — upsert on primary key field, no duplicates.
 *
 * Usage:  node src/seed/seedStructuredData.js
 */

require('dotenv').config();
const path = require('path');
const connectDB = require('../config/db');
const Company = require('../models/Company');
const User = require('../models/User');
const MasterRecord = require('../models/MasterRecord');

// ─── Exact moduleKey mapping (label from JSON → moduleKey in registry) ────────
const PAGE_TO_MODULE_KEY = {
  'Settings.Business Masters':        'settings/setting/business',
  'Settings.Company Locations':       'settings/setting/companylocations',
  'Settings.Ledger Group':            'settings/setting/ledgergroups',
  'Settings.Ledger':                  'settings/setting/ledger',
  'Settings.Ledger Mapping':          'settings/setting/ledgergroupmapping',
  'Settings.Ledger Setting':          'settings/setting/ledgersetting',
  'Settings.Doc Setup':               'settings/setting/docsetup',
  'Settings.Purchase Group Master':   'settings/setting/purchasegroup',
  'Settings.Goods Type Master':       'settings/setting/goodstype',
  'Settings.Stock Point Master':      'settings/setting/stockpoint',
  'Settings.Pos Counter Master':      'settings/setting/poscounter',
  'Settings.Barcode Settings':        'settings/setting/barcodesetting',
  'Settings.Split Barcode Settings':  'settings/setting/split-barcode-setting',
  'Settings.Barcode Label Settings':  'settings/setting/barcode-label-setting',
  'Settings.Procurement Type Master': 'settings/setting/procurementtype',
  'Settings.Payment Method Master':   'settings/setting/paymentmethod',
  'Settings.Tax Master':              'settings/setting/tax',
  'Settings.HSN Master':              'settings/setting/hsn',
  'Settings.Purchase Charge Master':  'settings/setting/purchase/master/charge',
  'Settings.Purchase Term Master':    'settings/setting/purchase/master/term',
  'Settings.Sales Charge Master':     'settings/setting/sales/master/charge',
  'Settings.Sales Term Master':       'settings/setting/sales/master/term',
  'Settings.Invoice Layout Setting':  'settings/setting/invoice-layout-setting',
  'Settings.Business Contact':        'settings/setting/business-contact',
  'Inventory.Filter':                 'inventory/inventory/product/filter',
  'Inventory.Group':                  'inventory/inventory/product/group',
  'Inventory.Unit of Measurement':    'inventory/inventory/uom',
  'Inventory.Attribute Addons':       'inventory/inventory/attribute-addon',
  'Inventory.Category':               'inventory/inventory/category',
  'Inventory.Item':                   'inventory/inventory/item',
  'Inventory.Print Label':            'inventory/inventory/barcode-print',
  'Inventory.Stock Adjustment':       'inventory/inventory/stock-adjustment',
  'Contacts.Contact Types':           'contacts/contact/contact-type',
  'Contacts.Suppliers':               'contacts/contact/supplier',
  'Contacts.Agents':                  'contacts/contact/agent',
  'Contacts.Customers':               'contacts/contact/customer',
  'Purchase.Goods Receipt Challan':   'purchase/transaction/purchase/grc',
  'Purchase.Purchase Invoice':        'purchase/transaction/purchase/invoice',
  'Purchase.Goods Return Note':       'purchase/transaction/purchase/grt',
  'Purchase.Debit Note':              'purchase/transaction/purchase/debitnote',
  'Sell.Delivery Challan':            'sell/transaction/sell/deliverychallan',
  'Sell.Sales Invoice':               'sell/transaction/sell/salesinvoice',
  'Sell.Sales Return':                'sell/transaction/sell/salereturn',
  'Sell.Credit Note':                 'sell/transaction/sell/creditnote',
  'Sell.POS':                         'sell/transaction/sell/pos',
  'Sell.POS Return':                  'sell/transaction/sell/pos-return',
  'Sell.B2B Invoice':                 'sell/transaction/sell/b2binvoice',
  'Tools.Item Split':                 'tools/tools/item-split',
};

// ─── Per-module: raw display label → camelCase key (from registry columns) ────
const FIELD_REMAP = {
  'settings/setting/business': {
    'Business Name': 'businessName', 'Zip Code': 'zipCode',
    'State': 'state', 'City': 'city', 'Is Active': 'isActive',
  },
  'settings/setting/companylocations': {
    'Name': 'name', 'Landmark': 'landmark', 'Zip Code': 'zipCode',
    'State': 'state', 'City': 'city', 'Business': 'business',
  },
  'settings/setting/ledgergroups': {
    'Name': 'name', 'Is Active': 'isActive', 'Parent': 'parent',
  },
  'settings/setting/ledger': {
    'Name': 'name', 'Group': 'group', 'Is Active': 'isActive',
    'Default': 'default', 'Balance': 'balance', 'Opening Balance': 'openingBalance',
  },
  'settings/setting/ledgergroupmapping': {
    'Purpose': 'purpose', 'Ledger Group': 'ledgerGroup',
  },
  'settings/setting/ledgersetting': {
    'Purpose': 'purpose', 'Ledger': 'ledger',
  },
  'settings/setting/docsetup': {
    'Name': 'name', 'Type': 'type', 'Prefix': 'prefix', 'Suffix': 'suffix',
    'Start From': 'startFrom', 'Validity': 'validity', 'Fin Year': 'finYear',
  },
  'settings/setting/purchasegroup': {
    'Group Name': 'groupName', 'Business': 'business', 'Status': 'status',
  },
  'settings/setting/goodstype': {
    'Goods Name': 'goodsName', 'Business': 'business', 'Status': 'status',
  },
  'settings/setting/stockpoint': {
    'Stockpoint Name': 'stockpointName', 'Type Name': 'typeName',
    'Status': 'status', 'Parent': 'parent',
  },
  'settings/setting/poscounter': {
    'Counter Name': 'counterName', 'Invoice Layout': 'invoiceLayout',
    'Is Active': 'isActive', 'Repeat Invoice': 'repeatInvoice',
    'Business': 'business', 'Location': 'location',
  },
  'settings/setting/barcodesetting': {
    'Type': 'type', 'Sub Type': 'subType', 'Prefix': 'prefix', 'Suffix': 'suffix',
    'Start Number': 'startNumber', 'Sample Barcode': 'sampleBarcode',
    'Effective Date': 'effectiveDate', 'Expiry Date': 'expiryDate',
    'Financial Year': 'financialYear',
  },
  'settings/setting/split-barcode-setting': {
    'Use For': 'useFor', 'Prefix': 'prefix', 'Suffix': 'suffix',
    'Start Number': 'startNumber', 'Sample Barcode': 'sampleBarcode',
    'Effective Date': 'effectiveDate', 'Expiry Date': 'expiryDate',
    'Financial Year': 'financialYear',
  },
  'settings/setting/barcode-label-setting': {
    'Label Name': 'labelName', 'Description': 'description',
    'Page Size\n(width x height)': 'pageSize', 'Label Size\n(width x height)': 'labelSize',
    'Sticker In Row': 'stickerInRow',
  },
  'settings/setting/procurementtype': {
    'Procurement Type': 'procurementType', 'Status': 'status', 'Business': 'business',
  },
  'settings/setting/paymentmethod': {
    'Method Name': 'methodName', 'Is Active': 'isActive', 'Is Default': 'isDefault',
    'Is Cash': 'isCash', 'Is Loyalty': 'isLoyalty', 'Ledger Name': 'ledgerName',
  },
  'settings/setting/tax': {
    'Tax Name': 'taxName', 'IGST': 'igst', 'CGST': 'cgst',
    'SGST': 'sgst', 'CESS': 'cess', 'Status': 'status',
  },
  'settings/setting/hsn': {
    'Code': 'code', 'Effective Date': 'effectiveDate', 'Status': 'status',
  },
  'settings/setting/purchase/master/charge': {
    'Name': 'name', 'Type': 'type', 'Status': 'status', 'GST Position': 'gstPosition',
  },
  'settings/setting/purchase/master/term': { 'Name': 'name' },
  'settings/setting/sales/master/charge': {
    'Name': 'name', 'Type': 'type', 'Status': 'status', 'Business': 'business',
  },
  'settings/setting/sales/master/term': { 'Name': 'name' },
  'settings/setting/invoice-layout-setting': {
    'Layout Name': 'layoutName', 'Description': 'description',
  },
  'settings/setting/business-contact': {
    'Business': 'business', 'Contact': 'contact',
  },
  'inventory/inventory/product/filter': {
    'Name': 'name', 'Description': 'description', 'Parent': 'parent',
  },
  'inventory/inventory/product/group': {
    'Name': 'name', 'Business': 'business', 'Prefix': 'prefix', 'Parent': 'parent',
  },
  'inventory/inventory/uom': {
    'Name': 'name', 'Short Name': 'shortName', 'Allow Decimal': 'allowDecimal',
    'Default Value': 'defaultValue', 'Business': 'business',
  },
  'inventory/inventory/attribute-addon': { 'Name': 'name', 'Status': 'status' },
  'inventory/inventory/category': {
    'Name': 'name', 'Short Name': 'shortName', 'Short Code': 'shortCode',
    'Status': 'status', 'Parent': 'parent',
  },
  'inventory/inventory/item': {
    'Name': 'name', 'Item Type': 'itemType', 'HSN Code': 'hsnCode',
    'UOM': 'uom', 'Prefix': 'prefix', 'Item Code': 'itemCode',
    'Group': 'group', 'Sub Group': 'subGroup',
  },
  'inventory/inventory/barcode-print': {
    'Item Name': 'itemName', 'Item Code': 'itemCode', 'Quantity': 'quantity',
    'RSP Price': 'rspPrice', 'WSP Price': 'wspPrice', 'Barcode Copies': 'barcodeCopies',
  },
  'inventory/inventory/stock-adjustment': {
    'Adjustment No': 'adjustmentNo', 'Type': 'type', 'Creadted On': 'createdOn',
    'Reason': 'reason', 'Created By': 'createdBy',
  },
  'contacts/contact/contact-type': {
    'Type Name': 'typeName', 'Contact Type': 'contactType', 'Prefix': 'prefix',
    'Status': 'status', 'Business Name': 'businessName',
  },
  'contacts/contact/supplier': {
    'Business Name': 'businessName', 'Contact ID': 'contactId',
    'Name': 'name', 'Mobile': 'mobile', 'Email': 'email', 'Address': 'address',
  },
  'contacts/contact/agent': {
    'Name': 'name', 'Contact ID': 'contactId', 'Mobile': 'mobile',
    'Email': 'email', 'Address': 'address',
  },
  'contacts/contact/customer': {
    // Customers table has shifted columns — Action col holds the Name
    'Action': 'name', 'Business Name': 'contactId', 'Contact ID': 'name2',
    'Name': 'mobile', 'Mobile': 'email', 'Email': 'address',
  },
  'purchase/transaction/purchase/grc': {
    'Vendor Name': 'vendorName', 'GRC NO': 'grcNo', 'GRC Date': 'grcDate',
    'Logistic No': 'logisticNo', 'Purchase Group': 'purchaseGroup',
    'Occasion': 'occasion', 'Agent': 'agent', 'Vendor Doc No': 'vendorDocNo',
    'Procurement Type': 'procurementType', 'Purchase Term': 'purchaseTerm',
    'Taxable': 'taxable', 'Total Quantity': 'totalQuantity',
    'GST': 'gst', 'Net Amount': 'netAmount',
  },
  'purchase/transaction/purchase/invoice': {
    'Purchase Invoice': 'purchaseInvoice', 'Purchase Date': 'purchaseDate',
    'Supplier Name': 'supplierName', 'GRC NO': 'grcNo',
    'Net Purchase Amt': 'netPurchaseAmt', 'Total Payable': 'totalPayable',
  },
  'purchase/transaction/purchase/grt': {
    'GRT NO': 'grtNo', 'GRT Date': 'grtDate', 'Supplier Name': 'supplierName',
    'GRC NO': 'grcNo', 'Qty': 'qty',
  },
  'purchase/transaction/purchase/debitnote': {
    'Debit Note No': 'debitNoteNo', 'Debit Creadted': 'debitCreated',
    'Supplier': 'supplier', 'GRT NO': 'grtNo', 'Qty': 'qty',
    'Value': 'value', 'Remaining': 'remaining',
    'Adj. Status': 'adjStatus', 'Adjusted Against (PI)': 'adjustedAgainstPi',
  },
  'sell/transaction/sell/deliverychallan': {
    'Delivery Challan No': 'deliveryChallanNo', 'Customer Name': 'customerName',
    'Customer Mobile': 'customerMobile', 'Customer GST No': 'customerGstNo',
    'Creadted On': 'createdOn', 'Logistic No': 'logisticNo',
  },
  'sell/transaction/sell/salesinvoice': {
    'Sales Invoice No': 'salesInvoiceNo', 'Customer Name': 'customerName',
    'Customer Mobile': 'customerMobile', 'Customer GST No': 'customerGstNo',
    'Delivery Challan No': 'deliveryChallanNo', 'Creadted On': 'createdOn',
  },
  'sell/transaction/sell/salereturn': {
    'Customer Name': 'customerName', 'Sales Return No': 'salesReturnNo', 'Creadted On': 'createdOn',
  },
  'sell/transaction/sell/creditnote': {
    'Customer Name': 'customerName', 'Credit Note Code': 'creditNoteCode',
    'Total Qty': 'totalQty', 'Creadted On': 'createdOn',
  },
  'sell/transaction/sell/pos': {
    'Date': 'date', 'Invoice No': 'invoiceNo', 'Counter': 'counter',
    'Customer Name': 'customerName', 'Customer Contact': 'customerContact',
    'Exempted': 'exempted', 'Billing Type': 'billingType',
    'Payment Status': 'paymentStatus', 'Total Amount': 'totalAmount',
    'Paid': 'paid', 'Sell Due': 'sellDue',
  },
  'sell/transaction/sell/pos-return': {
    'Date': 'date', 'Invoice No': 'invoiceNo', 'Parent Invoice': 'parentInvoice',
    'Customer Name': 'customerName', 'Payment Status': 'paymentStatus',
    'Total Amount': 'totalAmount', 'Location': 'location',
  },
  'sell/transaction/sell/b2binvoice': {
    'Location': 'location', 'Invoice No': 'invoiceNo', 'Customer Name': 'customerName',
    'Customer Contact': 'customerContact', 'GST No': 'gstNo', 'State': 'state',
    'Total Taxable': 'totalTaxable', 'Total IGST Amount': 'totalIgstAmount',
    'Total CGST Amount': 'totalCgstAmount', 'Total SGST Amount': 'totalSgstAmount',
  },
  'tools/tools/item-split': {
    'Split Code': 'splitCode', 'Item Code': 'itemCode', 'Item Name': 'itemName',
    'Is Complete': 'isComplete', 'Creator': 'creator', 'Created At': 'createdAt',
  },
};

// The camelCase key used to identify a unique record for upsert per module
const PRIMARY_KEY = {
  'settings/setting/business':             'businessName',
  'settings/setting/companylocations':     'name',
  'settings/setting/ledgergroups':         'name',
  'settings/setting/ledger':               'name',
  'settings/setting/ledgergroupmapping':   'purpose',
  'settings/setting/ledgersetting':        'purpose',
  'settings/setting/docsetup':             'name',
  'settings/setting/purchasegroup':        'groupName',
  'settings/setting/goodstype':            'goodsName',
  'settings/setting/stockpoint':           'stockpointName',
  'settings/setting/poscounter':           'counterName',
  'settings/setting/barcodesetting':       'prefix',
  'settings/setting/split-barcode-setting':'useFor',
  'settings/setting/barcode-label-setting':'labelName',
  'settings/setting/procurementtype':      'procurementType',
  'settings/setting/paymentmethod':        'methodName',
  'settings/setting/tax':                  'taxName',
  'settings/setting/hsn':                  'code',
  'settings/setting/purchase/master/charge': 'name',
  'settings/setting/purchase/master/term': 'name',
  'settings/setting/sales/master/charge':  'name',
  'settings/setting/sales/master/term':    'name',
  'settings/setting/invoice-layout-setting':'layoutName',
  'settings/setting/business-contact':     'business',
  'inventory/inventory/product/filter':    'name',
  'inventory/inventory/product/group':     'name',
  'inventory/inventory/uom':               'name',
  'inventory/inventory/attribute-addon':   'name',
  'inventory/inventory/category':          'name',
  'inventory/inventory/item':              'name',
  'inventory/inventory/barcode-print':     'itemCode',
  'inventory/inventory/stock-adjustment':  'adjustmentNo',
  'contacts/contact/contact-type':         'typeName',
  'contacts/contact/supplier':             'contactId',
  'contacts/contact/agent':                'contactId',
  'contacts/contact/customer':             'name',
  'purchase/transaction/purchase/grc':     'grcNo',
  'purchase/transaction/purchase/invoice': 'purchaseInvoice',
  'purchase/transaction/purchase/grt':     'grtNo',
  'purchase/transaction/purchase/debitnote':'debitNoteNo',
  'sell/transaction/sell/deliverychallan': 'deliveryChallanNo',
  'sell/transaction/sell/salesinvoice':    'salesInvoiceNo',
  'sell/transaction/sell/salereturn':      'salesReturnNo',
  'sell/transaction/sell/creditnote':      'creditNoteCode',
  'sell/transaction/sell/pos':             'invoiceNo',
  'sell/transaction/sell/pos-return':      'invoiceNo',
  'sell/transaction/sell/b2binvoice':      'invoiceNo',
  'tools/tools/item-split':               'splitCode',
};

// Completely skip these display keys — Action, Choice, etc.
const SKIP_DISPLAY_KEYS = new Set(['Action', 'Choice', 'Default', 'Preview']);

// Placeholder-only values that mean "no real data"
const PLACEHOLDER_VALUES = new Set(['No Data..', 'No Item Found', 'No data found', 'No Data Found']);

const isPlaceholderRow = (raw) => {
  const vals = Object.values(raw).map((v) => String(v ?? '').trim()).filter(Boolean);
  if (!vals.length) return true;
  return vals.every((v) => PLACEHOLDER_VALUES.has(v) || v === '');
};

/**
 * Remap a raw row to camelCase fields using the module's FIELD_REMAP table.
 * Any key not in the remap table is skipped.
 */
const remapFields = (moduleKey, rawRow) => {
  const remap = FIELD_REMAP[moduleKey] || {};
  const out = {};
  for (const [rawKey, rawVal] of Object.entries(rawRow)) {
    if (SKIP_DISPLAY_KEYS.has(rawKey)) continue;
    const camelKey = remap[rawKey];
    if (!camelKey) continue;
    const val = String(rawVal ?? '').trim();
    if (val === '') continue;
    out[camelKey] = val;
  }
  return out;
};

const main = async () => {
  await connectDB();

  // ── 1. Load structured data ──────────────────────────────────────────────
  let structuredData;
  try {
    structuredData = require(path.join(__dirname, '..', '..', 'public', '_structured_data.json'));
  } catch (err) {
    console.error('[SeedData] Cannot read _structured_data.json:', err.message);
    process.exit(1);
  }

  // ── 2. Ensure seed company exists ────────────────────────────────────────
  let company = await Company.findOne({ code: 'TEMPFAB' });
  if (!company) {
    const adminUser = await User.findOne({ isSuperAdmin: true });
    company = await Company.create({
      name: 'Temple Fabrics',
      code: 'TEMPFAB',
      businessType: 'Retail',
      businessCategory: 'Textiles',
      email: 'admin@templefabrics.com',
      phone: '9916311500',
      address: { city: 'Bangalore Urban', state: 'Karnataka', pincode: '560011', country: 'India' },
      subscriptionPlan: 'professional',
      status: 'active',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      createdBy: adminUser?._id,
    });
    console.log(`[SeedData] Created company: ${company.name} (${company.code})`);
  } else {
    console.log(`[SeedData] Using existing company: ${company.name} (${company.code})`);
  }

  // ── 3. Wipe ALL existing MasterRecords for this company to start clean ───
  const wipeResult = await MasterRecord.deleteMany({ company: company._id });
  console.log(`[SeedData] Cleared ${wipeResult.deletedCount} existing records`);

  // ── 4. Seed each mapped page ─────────────────────────────────────────────
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const [sectionName, pages] of Object.entries(structuredData)) {
    for (const [pageName, pageData] of Object.entries(pages)) {
      const mapKey = `${sectionName}.${pageName}`;
      const moduleKey = PAGE_TO_MODULE_KEY[mapKey];
      if (!moduleKey) continue;

      const tables = pageData?.tables;
      if (!Array.isArray(tables) || tables.length === 0) continue;

      // Use only the first table (tables[0] is always the main listing)
      const rows = tables[0];
      if (!Array.isArray(rows)) continue;

      const pkField = PRIMARY_KEY[moduleKey];
      let moduleCreated = 0;

      for (const rawRow of rows) {
        if (isPlaceholderRow(rawRow)) { totalSkipped++; continue; }

        const fields = remapFields(moduleKey, rawRow);
        if (Object.keys(fields).length === 0) { totalSkipped++; continue; }

        // Skip rows where the primary key value is missing
        if (pkField && !fields[pkField]) { totalSkipped++; continue; }

        // Derive status from common status fields
        const rawStatus = fields.isActive || fields.status || 'active';
        const status = /^(active|yes)$/i.test(rawStatus) ? 'active' : 'inactive';

        await MasterRecord.create({ company: company._id, moduleKey, fields, status });
        totalCreated++;
        moduleCreated++;
      }

      console.log(`  ✓ ${moduleKey.padEnd(52)} ${moduleCreated} records`);
    }
  }

  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log(`[SeedData] Done — ${totalCreated} created, ${totalSkipped} skipped`);
  console.log('══════════════════════════════════════════════════');
  process.exit(0);
};

main().catch((err) => {
  console.error('[SeedData] Fatal error:', err);
  process.exit(1);
});
