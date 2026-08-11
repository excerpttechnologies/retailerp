require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/User');
const Company = require('../models/Company');
const MasterRecord = require('../models/MasterRecord');
const seedModuleConfigs = require('./seedModuleConfigs');

const STORE_FILES = [
  { file: 'Temple Fabrics.json', companyName: 'Temple Fabrics' },
  { file: 'TEMPLE FABRICS, SILKS & SAREES.json', companyName: 'Temple Fabrics, Silks & Sarees' },
  { file: 'SUVARNA FABRICS.json', companyName: 'Suvarna Fabrics' },
  { file: 'OMSHREE FABS (TEMPLE FABRICS , SILKS AND SAREES).json', companyName: 'Omshree Fabs (Temple Fabrics, Silks and Sarees)' },
];

const normalizeText = (value) => (value == null ? '' : String(value).toString().trim());
const normalizeCode = (value) => normalizeText(value).toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 20) || 'STORE';
const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const ensureCompanyAndWarehouse = async (companyName) => {
  const normalizedName = normalizeText(companyName) || 'Unknown Store';
  const code = normalizeCode(normalizedName);
  const company = await Company.findOneAndUpdate(
    { name: normalizedName },
    {
      $setOnInsert: {
        name: normalizedName,
        code,
        email: `${code.toLowerCase()}@example.com`,
        status: 'active',
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const warehouseName = `${normalizedName} Warehouse`;
  const warehouseCode = `${code}WH`;
  const warehouse = await MasterRecord.findOneAndUpdate(
    { company: company._id, moduleKey: 'settings/setting/warehouses', 'fields.warehouseName': warehouseName },
    {
      $set: {
        company: company._id,
        moduleKey: 'settings/setting/warehouses',
        fields: {
          warehouseName,
          warehouseCode,
        },
        status: 'active',
      },
    },
    { upsert: true, new: true }
  );

  return { company, warehouse };
};

const upsertGroupRecord = async (companyId, groupName, parentName) => {
  const name = normalizeText(groupName);
  if (!name) return null;
  return MasterRecord.findOneAndUpdate(
    { company: companyId, moduleKey: 'inventory/inventory/product/group', 'fields.name': name },
    {
      $set: {
        company: companyId,
        moduleKey: 'inventory/inventory/product/group',
        fields: {
          name,
          business: normalizeText(parentName) ? '' : '',
          prefix: '',
          parent: normalizeText(parentName),
        },
        status: 'active',
      },
    },
    { upsert: true, new: true }
  );
};

const seedStore = async (storeFile) => {
  const filePath = path.resolve(__dirname, '..', '..', 'public', storeFile.file);
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const companyName = normalizeText(raw.company || raw.store || storeFile.companyName);
  const { company } = await ensureCompanyAndWarehouse(companyName);

  const items = Array.isArray(raw.items) ? raw.items : [];
  const barcodeItems = Array.isArray(raw.barcodeItems) ? raw.barcodeItems : [];
  const itemLookup = new Map();

  const groupNames = new Set();
  items.forEach((item) => {
    if (item.group) groupNames.add(item.group);
    if (item.subGroup) groupNames.add(item.subGroup);
  });

  for (const name of Array.from(groupNames)) {
    await upsertGroupRecord(company._id, name, '');
  }

  let seededItems = 0;
  let seededBarcodeItems = 0;

  for (const item of items) {
    try {
      const itemName = normalizeText(item.name || item.itemCode || 'Unnamed Item');
      const itemCode = normalizeText(item.itemCode || item.name || itemName);
      const groupName = normalizeText(item.group);
      const subGroupName = normalizeText(item.subGroup);

      if (groupName) await upsertGroupRecord(company._id, groupName, '');
      if (subGroupName) await upsertGroupRecord(company._id, subGroupName, groupName || '');

      const itemDoc = await MasterRecord.findOneAndUpdate(
        {
          company: company._id,
          moduleKey: 'inventory/inventory/item',
          $or: [
            { 'fields.itemCode': itemCode },
            { 'fields.name': itemName },
          ],
        },
        {
          $set: {
            company: company._id,
            moduleKey: 'inventory/inventory/item',
            fields: {
              name: itemName,
              itemType: normalizeText(item.itemType) || 'Simple',
              hsnCode: normalizeText(item.hsnCode),
              uom: normalizeText(item.uom),
              prefix: normalizeText(item.prefix),
              itemCode,
              group: groupName,
              subGroup: subGroupName,
            },
            status: 'active',
          },
        },
        { upsert: true, new: true }
      );

      itemLookup.set(itemCode || itemName, itemDoc._id);
      seededItems += 1;
    } catch (error) {
      console.warn(`[Seed] Skipped item for ${companyName}: ${error.message}`);
    }
  }

  for (const entry of barcodeItems) {
    try {
      const barcodeNo = normalizeText(entry.barcodeNo || entry.barcode || entry.barcodeNo || '');
      const itemCode = normalizeText(entry.itemCode || entry.itemCode || '');
      const itemName = normalizeText(entry.itemName || entry.name || '');
      const groupName = normalizeText(entry.group);
      const subGroupName = normalizeText(entry.subGroup);

      if (groupName) await upsertGroupRecord(company._id, groupName, '');
      if (subGroupName) await upsertGroupRecord(company._id, subGroupName, groupName || '');

      const barcodeDoc = await MasterRecord.findOneAndUpdate(
        {
          company: company._id,
          moduleKey: 'inventory/inventory/barcodeitem',
          $or: [
            { 'fields.barcodeNo': barcodeNo },
            { 'fields.itemCode': itemCode },
            { 'fields.itemName': itemName },
          ],
        },
        {
          $set: {
            company: company._id,
            moduleKey: 'inventory/inventory/barcodeitem',
            fields: {
              name: itemName || barcodeNo || 'Barcode Item',
              item: itemLookup.get(itemCode || itemName) || null,
              itemCode,
              itemName,
              group: groupName,
              subGroup: subGroupName,
              hsh: normalizeText(entry.hsh),
              supplier: normalizeText(entry.supplier),
              stock: toNumber(entry.stock),
              cp: toNumber(entry.cp),
              rsp: toNumber(entry.rsp),
              wsp: toNumber(entry.wsp),
              dp: toNumber(entry.dp),
              grcNo: normalizeText(entry.grcNo),
              barcodeNo,
              image: normalizeText(entry.image),
            },
            status: 'active',
          },
        },
        { upsert: true, new: true }
      );

      if (barcodeDoc) seededBarcodeItems += 1;
    } catch (error) {
      console.warn(`[Seed] Skipped barcode item for ${companyName}: ${error.message}`);
    }
  }

  console.log(`Seeding store: ${companyName}... ✓ ${seededItems} items, ${seededBarcodeItems} barcode items`);
};

const run = async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'adminonly@gmail.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '123456';

  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      name: 'Super Admin',
      email,
      password,
      isSuperAdmin: true,
      status: 'active',
    });
    console.log(`[Seed] Super admin created -> email: ${email} | password: ${password}`);
    console.log('[Seed] IMPORTANT: change this password after first login.');
  } else {
    console.log(`[Seed] Super admin already exists: ${email}`);
  }

  await seedModuleConfigs();

  for (const storeFile of STORE_FILES) {
    await seedStore(storeFile);
  }

  console.log('Seeding complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('[Seed] Error:', err.message);
  process.exit(1);
});
