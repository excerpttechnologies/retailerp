const path = require('path');

// Central registry — derived from moduleRegistry.seed.js (single source of truth).
// moduleKey values are exact nested URL paths (e.g. settings/setting/business).
const moduleRegistrySeed = require('./moduleRegistry.seed');
const { MODULE_CONFIGS } = require('../seed/moduleConfigData');

const DEFAULT_BUTTONS = ['ADD', 'Export CSV', 'Refresh', 'Edit', 'Delete'];

let structuredData = {};
try {
  structuredData = require(path.join(__dirname, '..', '..', 'public', '_structured_data.json'));
} catch (err) {
  console.warn('[Registry] structured data load failed:', err.message);
}

const normalizeHeader = (header = '') =>
  header
    .toString()
    .trim()
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();

const toCamelKey = (label = '') => {
  const words = normalizeHeader(label).split(' ').filter(Boolean);
  return words
    .map((word, index) =>
      index === 0 ? word : `${word[0]?.toUpperCase() || ''}${word.slice(1)}`
    )
    .join('');
};

const structuredDataAliases = {
  'settings/setting/location-setting': 'General Setting (Location)',
  'settings/setting/branches': 'Branches',
  'settings/setting/departments': 'Departments',
  'settings/setting/warehouses': 'Warehouses',
  'settings/setting/cost-centers': 'Cost Centers',
  'cash-register/cashregister': 'Cash Register',
  'ledger-transaction/ledgertnx': 'Ledger Transaction',
};

const moduleConfigAliases = {
  'settings/setting/voucher-setting': 'voucherSettings',
  'settings/setting/purchase_setting': 'purchaseSetting',
  'settings/setting/loyaltypoint': 'loyaltyPoint',
  'settings/setting/login-security': 'loginSecurity',
  'settings/setting/pos_setting': 'posSettings',
  'settings/setting/ecom_setting': 'ecomSettings',
  'settings/setting/location-setting': 'generalSettingLocation',
  'communication/communication/email': 'emailSetup',
  'communication/communication/whatsapp': 'whatsappSetup',
  'accounts/accounts/changepassword': 'changePassword',
};

const moduleConfigFallbacks = {
  emailSetup: [
    { key: 'smtpHost', label: 'SMTP Host', type: 'text', required: true },
    { key: 'smtpPort', label: 'SMTP Port', type: 'number', required: true },
    { key: 'smtpUsername', label: 'SMTP Username', type: 'text' },
    { key: 'smtpPassword', label: 'SMTP Password', type: 'password' },
    { key: 'fromAddress', label: 'From Address', type: 'email' },
    { key: 'useTls', label: 'Use TLS', type: 'checkbox' },
    { key: 'enabled', label: 'Enabled', type: 'checkbox' },
  ],
  whatsappSetup: [
    { key: 'apiUrl', label: 'API URL', type: 'text', required: true },
    { key: 'apiKey', label: 'API Key', type: 'text' },
    { key: 'senderId', label: 'Sender ID', type: 'text' },
    { key: 'phoneNumber', label: 'Phone Number', type: 'text' },
    { key: 'enabled', label: 'Enabled', type: 'checkbox' },
  ],
  changePassword: [
    { key: 'currentPassword', label: 'Current Password', type: 'password', required: true },
    { key: 'newPassword', label: 'New Password', type: 'password', required: true },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
  ],
};

const findStructuredDataPage = (config = {}) => {
  const section = normalizeHeader(config.section || config.category || '');
  const label = normalizeHeader(config.label || config.moduleKey?.split('/').pop() || '');
  if (!structuredData || !section) return null;

  let sectionKey = Object.keys(structuredData).find((sec) => normalizeHeader(sec) === section);
  if (!sectionKey) {
    sectionKey = Object.keys(structuredData).find((sec) => normalizeHeader(sec).includes(section) || section.includes(normalizeHeader(sec)));
  }
  if (!sectionKey) return null;

  const aliasLabel = structuredDataAliases[config.moduleKey];
  const aliasKey = aliasLabel ? Object.keys(structuredData[sectionKey] || {}).find((page) => normalizeHeader(page) === normalizeHeader(aliasLabel)) : null;
  if (aliasKey) return structuredData[sectionKey][aliasKey];

  const pageKey = Object.keys(structuredData[sectionKey] || {}).find((page) => normalizeHeader(page) === label);
  if (pageKey) return structuredData[sectionKey][pageKey];

  const fuzzyKey = Object.keys(structuredData[sectionKey] || {}).find((page) => normalizeHeader(page).includes(label) || label.includes(normalizeHeader(page)));
  if (fuzzyKey) return structuredData[sectionKey][fuzzyKey];

  return null;
};

const prependFieldsFromSeedConfig = (config = {}) => {
  const aliasKey = moduleConfigAliases[config.moduleKey];
  if (!aliasKey) return [];

  const fallback = MODULE_CONFIGS.find((entry) => entry.moduleKey === aliasKey);
  if (fallback && Array.isArray(fallback.formFields)) {
    return fallback.formFields.map((field) => ({
      ...field,
      required: field.required || false,
      sortable: field.sortable !== false,
      exportable: field.exportable !== false,
      placeholder: field.placeholder || '',
    }));
  }

  const configFallback = moduleConfigFallbacks[aliasKey];
  if (configFallback && Array.isArray(configFallback)) {
    return configFallback.map((field) => ({
      ...field,
      required: field.required || false,
      sortable: field.sortable !== false,
      exportable: field.exportable !== false,
      placeholder: field.placeholder || '',
    }));
  }

  return [];
};

const deriveFormFieldsFromStructuredData = (config = {}) => {
  const moduleData = findStructuredDataPage(config);
  const seedFallback = prependFieldsFromSeedConfig(config);
  if (!moduleData) return seedFallback;

  const rows = Array.isArray(moduleData.tables?.[0]) ? moduleData.tables[0] : [];
  const columns = rows.length ? Array.from(new Set(rows.flatMap((row) => Object.keys(row)))) : [];
  const modalKeys = Array.isArray(moduleData.modals)
    ? Array.from(
        moduleData.modals.reduce((set, modal) => {
          if (modal && typeof modal === 'object') {
            Object.keys(modal).forEach((key) => set.add(key));
          }
          return set;
        }, new Set())
      )
    : [];

  const headers = Array.from(new Set([...(columns || []), ...(modalKeys || [])]));
  const validHeaders = headers.filter((name) => name && name !== 'Action');
  if (!validHeaders.length) return seedFallback;

  const existingKeys = new Map(
    (Array.isArray(config.columns) ? config.columns : []).map((col) => [normalizeHeader(col.label || col.key), col.key])
  );

  const formFields = validHeaders.map((header) => {
    const normalized = normalizeHeader(header);
    const key = existingKeys.get(normalized) || toCamelKey(header);
    return {
      key,
      label: header,
      type: 'text',
      required: false,
      sortable: true,
      exportable: true,
      placeholder: '',
    };
  });

  return seedFallback.length ? seedFallback : formFields;
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

const decorateModule = (config) => {
  const decorated = {
    collectionName: 'MasterRecord',
    pageType: 'master',
    buttons: DEFAULT_BUTTONS,
    permissions: ['masterData'],
    ...config,
    section: config.section || config.category,
    category: config.section || config.category,
  };

  if (!decorated.formFields?.length) {
    decorated.formFields = deriveFormFieldsFromColumns(decorated);
    if (!decorated.formFields?.length) {
      decorated.formFields = deriveFormFieldsFromStructuredData(decorated);
    }
    decorated.fields = decorated.formFields;
  }

  return decorated;
};

const REGISTRY = Object.fromEntries(
  moduleRegistrySeed.map((entry) => [entry.moduleKey, decorateModule(entry)])
);

const getModuleConfig = (moduleKey) => REGISTRY[moduleKey] || null;
const listModuleKeys = () => Object.keys(REGISTRY);

module.exports = {
  REGISTRY,
  getModuleConfig,
  listModuleKeys,
  moduleRegistrySeed,
};
