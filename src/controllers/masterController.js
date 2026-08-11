const asyncHandler = require('express-async-handler');
const MasterRecord = require('../models/MasterRecord');
const ModuleConfig = require('../models/ModuleConfig');
const Company = require('../models/Company');
const { getModuleConfig: getSeedModuleConfig, listModuleKeys, REGISTRY } = require('../config/moduleRegistry');
const { logAudit } = require('../utils/audit');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

/**
 * Resolve which company to scope queries to.
 * - Regular users: always use their own company
 * - Super admins: use their own company if set, else honour query/body override,
 *   else fall back to the seeded TEMPFAB company (the primary data company).
 */
const resolveCompany = async (req) => {
  const direct = scopeCompany(req);
  if (direct) return direct;
  if (req.user.isSuperAdmin) {
    if (req.query.company) return req.query.company;
    if (req.body?.company) return req.body.company;
    // prefer the seeded primary company by code, then fall back to newest active
    const fallback =
      await Company.findOne({ code: 'TEMPFAB', status: 'active' }).select('_id').lean() ||
      await Company.findOne({ status: 'active' }).sort({ createdAt: -1 }).select('_id').lean();
    return fallback?._id || null;
  }
  return null;
};

const deriveFormFieldsFromColumns = (config = {}) => {
  const columns = Array.isArray(config.columns) ? config.columns : [];
  return columns.map((column) => ({
    key: column.key,
    label: column.label || column.key,
    type: column.type || 'text',
    required: false,
    sortable: column.sortable !== false,
    exportable: column.exportable !== false,
    placeholder: column.placeholder || '',
  }));
};

const normalizeModuleConfig = (config = {}) => {
  const normalized = { ...config };
  if (!normalized.fields && normalized.formFields) {
    normalized.fields = normalized.formFields;
  }
  if (!normalized.formFields && normalized.fields) {
    normalized.formFields = normalized.fields;
  }

  if (!normalized.columns?.length && normalized.formFields?.length) {
    normalized.columns = normalized.formFields.slice(0, 5).map((field) => ({
      key: field.key,
      label: field.label,
      type: field.type || 'text',
      sortable: field.sortable !== false,
      exportable: field.exportable !== false,
    }));
  }

  if (!normalized.formFields?.length && normalized.columns?.length) {
    normalized.formFields = deriveFormFieldsFromColumns(normalized);
    normalized.fields = normalized.formFields;
  }

  normalized.section = normalized.section || normalized.category;
  normalized.category = normalized.section || normalized.category;

  return normalized;
};

const resolveRegistryModuleKey = (moduleKey) => {
  if (REGISTRY[moduleKey]) return moduleKey;
  const candidate = moduleKey.split('/').pop();
  const matches = Object.keys(REGISTRY).filter((key) => key.endsWith(`/${candidate}`));
  return matches.length === 1 ? matches[0] : moduleKey;
};

const getModuleConfig = async (moduleKey) => {
  const resolvedKey = resolveRegistryModuleKey(moduleKey);
  const cfg = await ModuleConfig.findOne({ moduleKey: resolvedKey, isActive: true }).lean();
  if (cfg) return normalizeModuleConfig(cfg);

  const seedConfig = getSeedModuleConfig(resolvedKey);
  if (seedConfig) return normalizeModuleConfig(seedConfig);

  return null;
};

const loadRegistry = async () => {
  const registry = Object.fromEntries(
    Object.entries(REGISTRY).map(([key, value]) => [key, normalizeModuleConfig(value)])
  );

  try {
    const configs = await ModuleConfig.find({ isActive: true }).lean();
    configs.forEach((cfg) => {
      if (registry[cfg.moduleKey]) {
        registry[cfg.moduleKey] = normalizeModuleConfig({ ...registry[cfg.moduleKey], ...cfg });
      }
    });
  } catch (err) {
    console.warn('[Registry] ModuleConfig read failed, using seed only:', err.message);
  }

  return registry;
};

// @desc  Return the full module registry (labels, sections, field configs)
// @route GET /api/master/registry
const getRegistry = asyncHandler(async (req, res) => {
  const registry = await loadRegistry();
  res.json({ success: true, registry });
});

const validateFields = (moduleConfig, fields) => {
  const fieldDefinitions = moduleConfig.formFields || moduleConfig.fields || [];
  for (const fieldDef of fieldDefinitions) {
    if (fieldDef.required && (fields[fieldDef.key] === undefined || fields[fieldDef.key] === '')) {
      throw new Error(`${fieldDef.label} is required`);
    }
  }
};

// @desc  Create a record for a given dynamic module
// @route POST /api/master/:moduleKey(*)
const createRecord = asyncHandler(async (req, res) => {
  const moduleKey = req.params.moduleKey || req.params[0];
  const moduleConfig = await getModuleConfig(moduleKey);
  if (!moduleConfig) {
    res.status(404);
    throw new Error(`Unknown module: ${moduleKey}`);
  }
  if (moduleConfig.pageType === 'special') {
    res.status(400);
    throw new Error(`Module ${moduleKey} uses a bespoke page, not generic CRUD`);
  }

  const fields = req.body.fields || req.body;
  validateFields(moduleConfig, fields);

  // Allow super-admins (or requests without a scoped company) to pass `company` in the body
  const company = req.body.company || await resolveCompany(req);
  if (!company) {
    res.status(400);
    throw new Error('company is required');
  }

  const record = await MasterRecord.create({
    company,
    moduleKey,
    fields,
    status: req.body.status || 'active',
    createdBy: req.user._id,
  });

  await logAudit({
    company: scopeCompany(req), user: req.user, module: moduleKey, action: 'create',
    recordId: record._id, summary: `Created ${moduleConfig.label}`,
  });

  res.status(201).json({ success: true, record });
});

// @desc  List records for a given dynamic module (search + pagination)
// @route GET /api/master/:moduleKey(*)
const getRecords = asyncHandler(async (req, res) => {
  const moduleKey = req.params.moduleKey || req.params[0];
  const moduleConfig = await getModuleConfig(moduleKey);
  if (!moduleConfig) {
    res.status(404);
    throw new Error(`Unknown module: ${moduleKey}`);
  }
  if (moduleConfig.pageType === 'special') {
    res.status(400);
    throw new Error(`Module ${moduleKey} uses a bespoke page, not generic CRUD`);
  }

  const { search, status, page = 1 } = req.query;
  let { limit } = req.query;
  const company = await resolveCompany(req);
  const query = { company, moduleKey, isDeleted: { $ne: true } };
  if (status) query.status = status;

  // Support returning all records when client requests: ?limit=all or ?limit=0 or ?top=true
  const returnAll = limit === 'all' || limit === '0' || req.query.top === 'true';

  // Normalize numeric limit; default to 20 when not provided or invalid
  let numericLimit = 20;
  if (!limit) numericLimit = 20;
  else if (!returnAll) {
    const n = Number(limit);
    numericLimit = Number.isFinite(n) && n > 0 ? n : 20;
  }

  let records = await MasterRecord.find(query).sort({ createdAt: -1 });

  if (search) {
    const q = search.toLowerCase();
    records = records.filter((r) => JSON.stringify(r.fields).toLowerCase().includes(q));
  }

  const total = records.length;
  let paged = [];
  let pages = 0;

  if (returnAll) {
    paged = records;
    pages = total > 0 ? 1 : 0;
    numericLimit = total;
  } else {
    const skip = (Number(page) - 1) * numericLimit;
    paged = records.slice(skip, skip + numericLimit);
    pages = numericLimit > 0 ? Math.ceil(total / numericLimit) : 0;
  }

  res.json({
    success: true,
    data: paged,
    pagination: { total, page: Number(page), limit: numericLimit, pages },
  });
});

// @desc  Get a single record
// @route GET /api/master/:moduleKey(*)/:id
const getRecordById = asyncHandler(async (req, res) => {
  const moduleKey = req.params.moduleKey || req.params[0];
  const company = await resolveCompany(req);
  const record = await MasterRecord.findOne({ _id: req.params.id, company, moduleKey });
  if (!record) {
    res.status(404);
    throw new Error('Record not found');
  }
  res.json({ success: true, record });
});

// @desc  Update a record
// @route PUT /api/master/:moduleKey(*)/:id
const updateRecord = asyncHandler(async (req, res) => {
  const moduleKey = req.params.moduleKey || req.params[0];
  const moduleConfig = await getModuleConfig(moduleKey);
  if (!moduleConfig) {
    res.status(404);
    throw new Error(`Unknown module: ${moduleKey}`);
  }

  const company = await resolveCompany(req);
  const record = await MasterRecord.findOne({ _id: req.params.id, company, moduleKey });
  if (!record) {
    res.status(404);
    throw new Error('Record not found');
  }

  const fields = req.body.fields || req.body;
  validateFields(moduleConfig, fields);

  record.fields = fields;
  if (req.body.status) record.status = req.body.status;
  await record.save();

  await logAudit({
    company: scopeCompany(req), user: req.user, module: moduleKey, action: 'update',
    recordId: record._id, summary: `Updated ${moduleConfig.label}`,
  });

  res.json({ success: true, record });
});

// @desc  Soft delete a record
// @route DELETE /api/master/:moduleKey(*)/:id
const deleteRecord = asyncHandler(async (req, res) => {
  const moduleKey = req.params.moduleKey || req.params[0];
  const company = await resolveCompany(req);
  const record = await MasterRecord.findOne({ _id: req.params.id, company, moduleKey });
  if (!record) {
    res.status(404);
    throw new Error('Record not found');
  }
  record.isDeleted = true;
  record.status = 'inactive';
  await record.save();

  await logAudit({
    company: scopeCompany(req), user: req.user, module: moduleKey, action: 'delete', recordId: record._id,
    summary: 'Deleted record',
  });

  res.json({ success: true, message: 'Record deleted' });
});

module.exports = { getRegistry, createRecord, getRecords, getRecordById, updateRecord, deleteRecord, listModuleKeys };
